var path = require('path');
var argv = require('yargs').argv;
var OpenBCIBoard = require('openbci-sdk');
var dsp = require('dsp.js');
var io = require('socket.io')(process.env.app_port || 8080);
var topogrid = require('topogrid');
var jStat = require('jstat').jStat;
var BCIFilter = require('./src/server/bci.filter');

var globalScale = 1.5;

// Sockets
io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on('bci:filter', function (filter) {
        BCIFilter.apply(filter);
    });
    
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

// OpenBCI
var board = new OpenBCIBoard.OpenBCIBoard({
    verbose: true
});

board.autoFindOpenBCIBoard()
    .then(onBoardFind)
    .catch(function () {
        if (!!(argv._[0] && argv._[0] === 'simulate')) {
            globalScale = 4;
            board.connect(OpenBCIBoard.OpenBCIConstants.OBCISimulatorPortName)
                .then(onBoardConnect);
        }
    });

// Board find handler
function onBoardFind (portName) {if (portName) {
        console.log('board found', portName);
        board.connect(portName)
            .then(onBoardConnect);
    }
}

// Board connect handler
function onBoardConnect () {
    board.on('ready', onBoardReady);
}

// Board ready handler
function onBoardReady () {
    board.streamStart();
    board.on('sample', onSample);
}

var bins = 128; // Approx .5 second
var bufferSize = 128;
var windowRefreshRate = 8;
var windowSize = bins / windowRefreshRate;
var sampleRate = board.sampleRate();
var sampleInterval = (1 / sampleRate) * 1000; // in milliseconds (4)
var sampleNumber = 0;
var signals = [[],[],[],[],[],[],[],[]];

var timeSeriesWindow = 5; // in seconds
var timeSeriesRate = 10; // emits time series every 10 samples (adds 40 ms delay because this * sampleInterval = 40
var seriesNumber = 0;
var timeline = generateTimeline(20, 2, 's');
var timeSeries = new Array(8).fill([]); // 8 channels
timeSeries = timeSeries.map(function () {
    return new Array((sampleRate * timeSeriesWindow)).fill(0).map(function (amplitude, channelNumber) {
        return offsetForGrid(amplitude, channelNumber);
    }); // / timeSeriesRate
});

// the parameters for the grid [x,y,z] where x is the min of the grid, y is the
// max of the grid and z is the number of points
var grid_params = [0,10,11];
var pos_x = [3,7,2,8,0,10,3,7]; // x coordinates of the data
var pos_y = [0,0,3,3,8,8,10,10]; // y coordinates of the data
// var data = [10,0,0,0,0,0,-10,30,25]; // the data values

function onSample (sample) {

    sampleNumber++;

    console.log('sample', sample);

    Object.keys(sample.channelData).forEach(function (channel, i) {
        signals[i].push(sample.channelData[channel]);
    });

    if (sampleNumber === bins) {

        var spectrums = [[],[],[],[],[],[],[],[]];

        signals.forEach(function (signal, index) {
            signal = BCIFilter.process(signal);
            var fft = new dsp.FFT(bufferSize, sampleRate);
            fft.forward(signal);
            spectrums[index] = parseObjectAsArray(fft.spectrum);
            spectrums[index] = voltsToMicrovolts(spectrums[index], true);
        });

        // Apply scaler
        var labels = new Array(bins / 2).fill()    
            .map(function (label, index) {
                return Math.ceil(index * (sampleRate / bins));
            });

        var spectrumsByBand = [];
        var bands = {
              delta: [1, 3],
              theta: [4, 8],
              alpha: [8, 12],
              beta: [13, 30],
              gamma: [30, 100]
        };

        for (band in bands) {
            spectrumsByBand[band] = filterBand(spectrums, labels, bands[band])
        }

        // Skip every 4, add unit
        labels = labels.map(function (label, index, labels) {
            return (index % 4 === 0 || index === (labels.length - 1)) ? label + ' Hz' : '';
        });

        io.emit('bci:fft', {
            data: spectrums,
            theta: spectrumsByBand.theta.spectrums,
            delta: spectrumsByBand.delta.spectrums,
            alpha: spectrumsByBand.alpha.spectrums,
            beta: spectrumsByBand.beta.spectrums,
            gamma: spectrumsByBand.gamma.spectrums,
            labels: labels
        });

        signals = signals.map(function (channel) {
            return channel.filter(function (signal, index) {
                return index > (windowSize - 1);
            });
        });

        var meanSpectrum = spectrums.map(function(channel){
          return jStat.mean(channel);
        });


        sampleNumber = bins - windowSize;

    }

    // Time Series
    seriesNumber++;

    timeSeries.forEach(function (channel, index) {
        channel.push(
            offsetForGrid(sample.channelData[index], index)
        );
        channel.shift();
    });

    if (seriesNumber === timeSeriesRate) {

        var amplitudes = signals.map(function (channel) {
            return (Math.round(voltsToMicrovolts(channel[channel.length - 1])[0])) + ' uV';
        });

        io.emit('bci:time', {
            data: timeSeries,
            amplitudes: amplitudes,
            timeline: timeline
        });

        seriesNumber = 0;

        grid = topogrid.create(pos_x,pos_y,sample.channelData,grid_params);
        var grid_flat = [].concat.apply([], grid);
        
        //**********//
        
        var Xs = signals.map(function (channel, i) {
            var x = [3,7,2,8,0,10,3,7]; 
            return channel.map(function (volt) {
                return volt + (x[i]);
            });
        });
        
        var Ys = signals.map(function (channel, i) {
            var y = [0,0,3,3,8,8,10,10]; 
            return channel.map(function (volt) {
                return volt + (y[i]);
            });
        });
        
        var plotX = [].concat.apply([], Xs).sort(function (a, b) {
            return a - b;
        });
        var plotY = [].concat.apply([], Ys).sort(function (a, b) {
            return a - b;
        });
        
        //**********//

        io.emit('bci:topo', {
            data: grid_flat,
            plot: {
                x: plotX,
                y: plotY
            }
        });
    }

}

// @TODO: initial dataset is returning messed up values
function offsetForGrid (amplitude, channelNumber) {
    var scaledAmplitude = amplitude * Math.pow(10, globalScale);
    var offset = 2 * (timeSeries.length - channelNumber) - 1;
    return parseFloat(scaledAmplitude + offset);
}

function voltsToMicrovolts (volts, log) {
    if (!Array.isArray(volts)) volts = [volts];
    return volts.map(function (volt) {
        return log ? Math.log10(Math.pow(10, 6) * volt) : Math.pow(10, 6) * volt;
    });
}

function parseObjectAsArray (obj) {
    var array = [];
    Object.keys(obj).forEach(function (key) {
        array.push(obj[key]);
    });
    return array;
}

function filterBand(spectrums, labels, range) {
    if (!spectrums ) return console.log('Please provide spectrums');
    spectrums = spectrums.map(function (channel) {
        return channel.filter(function (spectrum, index) {
            return labels[index] >= range[0] && labels[index] <= range[1];
        });
    });
    spectrums =  [spectrums.map(function (channel) {
        if (channel.length) {
            return channel.reduce(function (a, b) {
                    return a + b;
                }) / channel.length;
        } else return channel;
    })];
    return {
        spectrums: spectrums,
        labels: labels
    }
}

/**
 * generateTimeline
 * @param size
 * @param skip
 * @param suffix
 * @returns {Array.<T>}
 */
function generateTimeline (size, skip, suffix) {
    return new Array(size)
        .fill()
        .map(function (value, index) {
            return index;
        })
        .filter(function (value, index) {
            return index % skip === 0;
        })
        .map(function (value) {
            return (value ? '-' : '') + value + suffix;
        })
        .reverse();
}

/**
 * disconnectBoard
 */
function disconnectBoard () {
    board.streamStop()
        .then(function () {
            board.disconnect().then(function () {
                console.log('board disconnected');
                process.exit();
            });
        });
}

process.on('SIGINT', disconnectBoard);

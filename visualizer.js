var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var argv = require('yargs').argv;
var OpenBCIBoard = require('openbci-sdk');
var dsp = require('dsp.js');
var io = require('socket.io')(http);
var topogrid = require('topogrid');
var jStat = require('jstat').jStat;

// Sockets
io.on('connection', function(socket){
    console.log('A user connected');
});

// Server
app.use(express.static(path.join(__dirname, '/app')));

app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/app/index.html'));
});

http.listen(3060, function () {
    console.log('listening on port 3060');
});

// OpenBCI
var board = new OpenBCIBoard.OpenBCIBoard({
    verbose: true
});

board.autoFindOpenBCIBoard()
    .then(onBoardFind)
    .catch(function () {
        if (!!(argv._[0] && argv._[0] === 'simulate')) {
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
var timeSeriesRate = 10; // emits time series every 50 samples (adds 200 ms delay because this * sampleInterval  = 200
var seriesNumber = 0;
var timeSeries = new Array(8).fill([]); // 8 channels
timeSeries = timeSeries.map(function () {
    return new Array((sampleRate * timeSeriesWindow) ).fill(0).map(offsetForGrid); // / timeSeriesRate
});

// the parameters for the grid [x,y,z] where x is the min of the grid, y is the
// max of the grid and z is the number of points
var grid_params = [0,10,11];
var pos_x = [3,7,2,8,0,10,3,7]; // x coordinates of the data
var pos_y = [0,0,3,3,8,8,10,10]; // y coordinates of the data
// var data = [10,0,0,0,0,0,-10,30,25]; // the data values


function onSample (sample) {
    console.log('sample', sample);
    sampleNumber++;

    Object.keys(sample.channelData).forEach(function (channel, i) {
        signals[i].push(sample.channelData[channel]);
    });

    if (sampleNumber === bins) {

        var spectrums = [[],[],[],[],[],[],[],[]];

        signals.forEach(function (signal, index) {
            var fft = new dsp.FFT(bufferSize, sampleRate);
            fft.forward(signal);
            spectrums[index] = parseObjectAsArray(fft.spectrum);
            spectrums[index] = voltsToMicrovolts(spectrums[index], true);
        });

        var scaler = sampleRate / bins;

        var labels = new Array(bins / 2).fill()
            .map(function (x, i) {
                return Math.ceil(i * scaler);
            });

        var spectrumsByBand = [];
        var bands = {
              delta : [1, 3],
              theta : [4, 8],
              alpha : [9, 12],
              beta : [13, 30]
        };

        for(band in bands){
            spectrumsByBand[band] = filterBand(spectrums, labels, bands[band])
        }

        io.emit('bci:fft', {
            data: spectrums,
            theta: spectrumsByBand.theta.spectrums,
            delta: spectrumsByBand.delta.spectrums,
            alpha: spectrumsByBand.alpha.spectrums,
            beta: spectrumsByBand.beta.spectrums,
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

        grid = topogrid.create(pos_x,pos_y,meanSpectrum,grid_params);
        var grid_flat = [].concat.apply([], grid);

        io.emit('bci:topo', {
            data: grid_flat
        });

        sampleNumber = bins - windowSize;

    }

    // Time Series
    seriesNumber++;

    timeSeries.forEach(function (channel, index) {
        channel.push(
            offsetForGrid(
                sample.channelData[index],
                index
            )
        ); // + (index * 200) //voltsToMicrovolts(sample.channelData[index])
        channel.shift();
    });

    if (seriesNumber === timeSeriesRate) {
        io.emit('bci:time', {
            data: timeSeries,
            labels: new Array((sampleRate * timeSeriesWindow) / timeSeriesRate).fill(0)
        });
        seriesNumber = 0;
    }

}

function offsetForGrid (amplitude, channelNumber) {
    return (amplitude * Math.pow(10, 1))  + (2 * (timeSeries.length - channelNumber) - 1);
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
 * disconnectBoard
 */
function disconnectBoard () {
    board.streamStop()
        .then(function () {
            setTimeout(function () {
                board.disconnect().then(function () {
                    console.log('board disconnected');
                    process.exit();
                });
            }, 50);
        });
}

process.on('SIGINT', function () {
    setTimeout(disconnectBoard, 50);
});

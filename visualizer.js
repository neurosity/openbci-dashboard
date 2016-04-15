var path = require('path');
var argv = require('yargs').argv;
var OpenBCIBoard = require('openbci-sdk');
var dsp = require('dsp.js');
var io = require('socket.io')(8080);

// Sockets
io.on('connection', (socket) => {
    console.log('A socket connected');
});

// OpenBCI
var board = new OpenBCIBoard.OpenBCIBoard({
    verbose: true
});

board.autoFindOpenBCIBoard()
    .then(onBoardFind)
    .catch(() => {
        if (!!(argv._[0] && argv._[0] === 'simulate')) {
            board.connect(OpenBCIBoard.OpenBCIConstants.OBCISimulatorPortName)
                .then(onBoardConnect);
        }
    });

// Board find handler
function onBoardFind (portName) {
    if (portName) {
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
var windowRefreshRate = 64;
var windowSize = bins / windowRefreshRate;
var sampleRate = board.sampleRate();
var sampleNumber = 0;
var signals = [[],[],[],[],[],[],[],[]];

//var timeSeriesWindow = 5;
//var seriesNumber = 0;
//var timeSeries = new Array(8).fill([]); // 8 channels
//
//timeSeries = timeSeries.map(function (channel) {
//    return new Array(sampleRate * timeSeriesWindow).fill(0)
//});

var chartData = [
    ['Channels', 'Channel 1', 'Channel 2', 'Channel 3', 'Channel 4', 'Channel 5', 'Channel 6', 'Channel 7', 'Channel 8']
];

function onSample (sample) {

    //[['Channels', 'Channel 1', 'Channel 2', 'Channel 3', 'Channel 4', 'Channel 5', 'Channel 6', 'Channel 7', 'Channel 8'],
    //['0hz',  1000,      400],
    //['25hz',  1170,      460],
    //['35hz',  660,       1120],
    //['64hz',  1030,      540]]

    //console.log('sample', sample);
    sampleNumber++;

    Object.keys(sample.channelData).forEach(function (channel, i) {
        signals[i].push(sample.channelData[channel]);
    });

    // FFT
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

        labels.forEach(function (frequency) {
            chartData.push([frequency]);
        });

        spectrums.forEach(function (channel) {
            channel.forEach(function (spectrum, index) {
                chartData[index + 1].push(spectrum);
            });
        });

        io.emit('openBCIFFT', chartData);

        chartData = [
            ['Channels', 'Channel 1', 'Channel 2', 'Channel 3', 'Channel 4', 'Channel 5', 'Channel 6', 'Channel 7', 'Channel 8']
        ];

        signals = signals.map(function (channel) {
            return channel.filter(function (signal, index) {
                return index > (windowSize - 1);
            });
        });

        sampleNumber = bins - windowSize;

    }

    //timeSeries.forEach(function (channel, index) {
    //    channel.push(voltsToMicrovolts(sample.channelData[index]));
    //    channel.shift();
    //});

    //seriesNumber++;

    //// Time Series
    //if (seriesNumber === 2) {
    //    io.emit('openBCISeries', {
    //        data: timeSeries,
    //        labels: new Array(1250).fill(0)
    //    });
    //    seriesNumber = 0;
    //}


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
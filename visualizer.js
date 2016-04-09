var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var argv = require('yargs').argv;
var OpenBCIBoard = require('openbci-sdk');
var dsp = require('dsp.js');
var io = require('socket.io')(http);

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

http.listen(3030, function () {
    console.log('listening on port 3030');
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
    // @TODO: Add timer?
    //setTimeout(disconnectBoard, argv._[2]);
}

// @TODO: Refactor
var currentSample = 0;
var signals = [[],[],[],[],[],[],[],[]];
var spectrums = [[],[],[],[],[],[],[],[]];

// @TODO: Refactor
function onSample (sample) {
    console.log('sample', sample);
    currentSample++;

    Object.keys(sample.channelData).forEach(function (channel, i) {
        signals[i].push(sample.channelData[channel]);
    });

    if (currentSample === 256) { // Approx 1 second

        signals.forEach(function (signal, index) {
            var fft = new dsp.FFT(256, 256);
            console.log(fft);
            fft.forward(signal);
            spectrums[index] = parseObjectAsArray(fft.spectrum);
        });

        io.emit('openBCIFrequency', spectrums);
        currentSample = 0;
        signals = [[],[],[],[],[],[],[],[]];
        spectrums = [[],[],[],[],[],[],[],[]];
    }

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
                board.disconnect();
                console.log('board disconnected');
            }, 50);
        });
}
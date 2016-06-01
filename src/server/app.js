'use strict';

/**
 * External Dependencies
 */
var argv = require('yargs').argv;
var OpenBCIBoard = require('openbci-sdk');
var io = require('socket.io')(process.env.app_port || 8080);

/**
 * Internal Dependencies
 */
const Providers = require('./providers');
const Modules = require('./modules');
const Utils = require('./utils');   

// OpenBCI
const connector = new OpenBCIBoard.OpenBCIBoard({
    verbose: true
});

const Signals = new Providers.Signals({ connector, io });
const TimeSeries = new Modules.TimeSeries({ connector, io, signalEvent: Signals.signalEvent });
const Topo = new Modules.Topo({ connector, io, signalEvent: Signals.signalEvent });
const FFT = new Modules.FFT({ connector, io, signalEvent: Signals.signalEvent });

global.scale = 1.5;

connector.autoFindOpenBCIBoard()
    .then(onBoardFind)
    .catch(() => {
        if (!!(argv._[0] && argv._[0] === 'simulate')) {
            global.scale = 4;
            connector
                .connect(OpenBCIBoard.OpenBCIConstants.OBCISimulatorPortName)
                .then(onBoardConnect);
        }
    });

// Board find handler
function onBoardFind (portName) {
    if (portName) {
        console.log('board found', portName);
        connector.connect(portName)
            .then(onBoardConnect);
    }
}

// Board connect handler
function onBoardConnect () {
    connector.on('ready', onBoardReady);
}

// Board ready handler
function onBoardReady () {
    connector.streamStart();
    TimeSeries.listen();
    FFT.listen();
    Topo.listen();
    connector.on('sample', onSample);
}

function onSample (sample) {
    Signals.buffer(sample);
}

/**
 * disconnectBoard
 */
function disconnectBoard () {
    connector.streamStop()
        .then(function () {
            connector.disconnect().then(function () {
                console.log('board disconnected');
                process.exit();
            });
        });
}

process.on('SIGINT', disconnectBoard);

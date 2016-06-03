'use strict';
 
const constants = require('./constants'); 
const io = require('socket.io')(process.env.app_port || constants.sockets.port);

const Connectors = require('./connectors');
const Providers = require('./providers');
const Modules = require('./modules'); 

const Connector = new Connectors.Serialport({
    verbose: true
});

const Signal = new Providers.Signal({ io });
const Motion = new Providers.Motion({ io });

Connector.start().then(() => {
    const FFT = new Modules.FFT({ Signal });
    const Topo = new Modules.Topo({ Signal });
    const TimeSeries = new Modules.TimeSeries({ Signal });
});

Connector.stream((data) => {
    Signal.buffer(data);
    Motion.capture(data);
});

process.on(constants.events.terminate, Connector.stop);

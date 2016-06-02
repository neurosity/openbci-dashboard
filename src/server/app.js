'use strict';

const io = require('socket.io')(process.env.app_port || 8080);

const Connectors = require('./connectors');
const Providers = require('./providers');
const Modules = require('./modules');  
const constants = require('./constants'); 

const Connector = new Connectors.Serialport({
    verbose: true
});

const Signals = new Providers.Signals({ io });
const signal = Signals.signal;

Connector.start().then(() => {
    const FFT = new Modules.FFT({ io, signal });
    const Topo = new Modules.Topo({ io, signal });
    const TimeSeries = new Modules.TimeSeries({ io, signal });
});

Connector.stream((data) => {
    Signals.buffer(data);
});

process.on(constants.events.terminate, Connector.stop);



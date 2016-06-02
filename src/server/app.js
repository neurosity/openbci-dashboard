'use strict';

const Connectors = require('./connectors');
const Providers = require('./providers');
const Modules = require('./modules');  
const constants = require('./constants'); 

const Connector = new Connectors.Serialport({
    verbose: true
});

const Signal = new Providers.Signal();

Connector.start().then(() => {
    const FFT = new Modules.FFT({ Signal });
    const Topo = new Modules.Topo({ Signal });
    const TimeSeries = new Modules.TimeSeries({ Signal });
});

Connector.stream((data) => {
    Signal.buffer(data);
});

process.on(constants.events.terminate, Connector.stop);



'use strict';

const io = require('socket.io')(process.env.app_port || 8080);

const Connectors = require('./connectors');
const Providers = require('./providers');
const Modules = require('./modules');   

const Connector = new Connectors.Serialport({
    verbose: true
});

const Signals = new Providers.Signals({ connector: Connector, io });

Connector.start().then(() => {
    
    const TimeSeries = new Modules.TimeSeries({
        connector: Connector,
        signalEvent: Signals.signalEvent,
        io
    });
        
    const Topo = new Modules.Topo({
        connector: Connector,
        signalEvent: Signals.signalEvent,
        io
    });
        
    const FFT = new Modules.FFT({
        connector: Connector,
        signalEvent: Signals.signalEvent,
        io
    });
        
});

Connector.stream((data) => {
    Signals.buffer(data);
});

process.on('SIGINT', Connector.stop);



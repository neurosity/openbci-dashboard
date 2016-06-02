'use strict';

const Utils = require('../utils');
const EventEmitter = require('events');
const constants = require('../constants');

class SignalEmitter extends EventEmitter {}

module.exports = class Signals {
    
    constructor ({ io }) {
        this.io = io;
        this.signal = new SignalEmitter();
        this.bins = constants.signal.bins;
        this.bufferSize = constants.signal.bufferSize;
        this.windowRefreshRate = constants.signal.windowRefreshRate;
        this.windowSize = this.bins / this.windowRefreshRate;
        this.sampleRate = constants.signal.sampleRate;
        this.signals = [[],[],[],[],[],[],[],[]];
        this.sampleNumber = 0;
        this.init();
    }
    
    init () {
        // Sockets
        this.io.on('connection', (socket) => {
            socket.on(constants.events.filter, (filter) => {
                Utils.filter.apply(filter);
            });
        });
    }
    
    buffer (sample) {
        this.sampleNumber++;
        this.add(sample);
       
        if (this.sampleNumber === this.bins) {  
            this.signal.emit(constants.events.signal, [...this.signals]);
            this.window();
        }
    }
    
    add (sample) {
        console.log('sample', sample);
        Object.keys(sample.channelData).forEach((channel, i) => {
            this.signals[i].push(sample.channelData[channel]);
        });
    }
    
    window () {
        this.signals = this.signals.map((channel) => {
            return channel.filter((signal, index) => {
                return index > (this.windowSize - 1);
            });
        });
        this.sampleNumber = this.bins - this.windowSize;
    }
    
}

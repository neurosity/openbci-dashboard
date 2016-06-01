'use strict';

const Utils = require('../utils');
const EventEmitter = require('events');

class SignalEmitter extends EventEmitter {}

module.exports = class Signals {
    
    constructor ({ connector, io }) {
        this.connector = connector;
        this.io = io;
        this.signalEvent = new SignalEmitter();
        this.bins = 512; // aka ~2 seconds
        this.bufferSize = 512;
        this.windowRefreshRate = 32;
        this.windowSize = this.bins / this.windowRefreshRate;
        this.sampleRate = this.connector.sampleRate(); // aka 250
        this.sampleNumber = 0;
        this.signals = [[],[],[],[],[],[],[],[]];
        this.init();
    }
    
    init () {
        // Sockets
        this.io.on('connection', (socket) => {
            console.log('A user connected');
            socket.on('bci:filter', (filter) => {
                Utils.filter.apply(filter);
            });
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
    
    buffer (sample) {
        this.sampleNumber++;
        this.add(sample);
       
        if (this.sampleNumber === this.bins) {  
            this.signalEvent.emit('bci:signal', [...this.signals]); // clone array
            this.window();
        }
    }
    
    add (sample) {
        //console.log('sample added', sample);
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




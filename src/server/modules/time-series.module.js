'use strict';

const Utils = require('../utils');

module.exports = class TimeSeries {
    
    constructor ({ connector, io, signalEvent }) {
        this.connector = connector;
        this.io = io;
        this.signalEvent = signalEvent;
        this.sampleRate = this.connector.sampleRate();
        this.timeSeriesWindow = 5; // in seconds
        this.timeline = Utils.data.generateTimeline(20, 2, 's');
        this.timeSeries = this.create(8); // 8 channels
        this.amplitudes = [];
        this.subscribe();
    }
    
    subscribe () {
        this.signalEvent.on('bci:signal', (signal) => {  
            this.offsetForGrid(signal);
            this.signalToAmplitudes(signal);
            this.filter();
            this.emit();
        });
    }
    
    create (channelAmount) {
        let timeSeries = new Array(channelAmount).fill([]); 
        return timeSeries.map((channel, channelNumber) => {
            return new Array((this.sampleRate * this.timeSeriesWindow))
                .fill(0)
                .map((amplitude) => {
                    // @TODO: Migrate scale (4) elsewhere
                    return Utils.signal.offsetForGrid(amplitude, channelNumber, timeSeries.length, 4);
                });
        });
    }
    
    offsetForGrid (signal) {
        this.timeSeries.forEach((channel, channelIndex) => {
            // @TODO: Migrate scale (4) elsewhere
            channel.push(Utils.signal.offsetForGrid(signal[channelIndex][signal[channelIndex].length - 1], channelIndex, this.timeSeries.length, 4));
            channel.shift();
        });
    }
    
    filter () {
        this.timeSeries.forEach((signal) => {
            signal = Utils.filter.process(signal);
        });
    }
    
    signalToAmplitudes (signal) {
        this.amplitudes = signal.map((channel) => {
            return (Math.round(Utils.signal.voltsToMicrovolts(channel[channel.length - 1])[0])) + ' uV';
        });
    }
    
    emit () {
        this.io.emit('bci:time', {
            data: this.timeSeries,
            amplitudes: this.amplitudes,
            timeline: this.timeline
        });
    }
    
}

    
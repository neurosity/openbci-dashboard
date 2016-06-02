'use strict';

const Utils = require('../utils');
const constants = require('../constants');

module.exports = class TimeSeries {
    
    constructor ({ Signal }) {
        this.signal = Signal;
        this.sampleRate = constants.signal.sampleRate;
        this.windowSize = constants.time.windowSize;
        this.timeline = Utils.data.generateTimeline(constants.time.timeline, constants.time.skip, constants.units.seconds);
        this.timeSeries = this.create(constants.connector.channels);
        this.amplitudes = [];
        this.subscribe();
    }
    
    subscribe () {
        this.signal.emitter.on(constants.events.signal, (signal) => {  
            this.offsetForGrid(signal);
            this.signalToAmplitudes(signal);
            this.filter();
            this.emit();
        });
    }
    
    create (channelAmount) {
        let timeSeries = new Array(channelAmount).fill([]); 
        return timeSeries.map((channel, channelNumber) => {
            return new Array((this.sampleRate * this.windowSize))
                .fill(0)
                .map((amplitude) => {
                    return Utils.signal.offsetForGrid(amplitude, channelNumber, constants.connector.channels, this.signal.scale);
                });
        });
    }
    
    offsetForGrid (signal) {
        this.timeSeries.forEach((channel, channelIndex) => {
            let offset = signal[channelIndex][signal[channelIndex].length - 1];
            channel.push(Utils.signal.offsetForGrid(offset, channelIndex, constants.connector.channels, this.signal.scale));
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
            let microvolts = Utils.signal.voltsToMicrovolts(channel[channel.length - 1])[0];
            return `${Math.round(microvolts)} ${constants.units.microvolts}`;
        });
    }
    
    emit () {
        this.signal.io.emit(constants.events.time, {
            data: this.timeSeries,
            amplitudes: this.amplitudes,
            timeline: this.timeline
        });
    }
    
}

    
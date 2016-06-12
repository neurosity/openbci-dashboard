'use strict';

const Fili = require('fili');
const Utils = require('../utils');
const constants = require('../constants');

module.exports = class FFT {
    
    constructor ({ Signal }) {
        this.signal = Signal;
        this.bufferSize = constants.fft.bufferSize;
        this.bins = this.bufferSize / 4;
        this.sampleRate = constants.signal.sampleRate;
        this.bands = constants.bands;
        this.spectrums = [[],[],[],[],[],[],[],[]];
        this.byBand = [];
        this.labels = [];
        this.subscribe();
    }
        
    subscribe () {
        this.signal.emitter.on(constants.events.signal, (signals) => {
            //signals = this.trim(signals);    
            this.signalsToFFT(signals);
            this.scaleLabels();
            this.filterBands();
            this.filterLabels();
            this.emit(); 
        });
    }
    
    trim (signals) {
        return signals.map((channel) => {
            return channel.splice(this.bins, this.bufferSize);
        });
    }
    
    signalsToFFT (signals) {
        signals.forEach((signal, index) => {
            //signal = Utils.filter.process(signal);
            let fft = new Fili.Fft(constants.fft.bufferSize);
            let spectrum = fft.forward(signal, constants.fft.windowFunction);
            this.spectrums[index] = fft.magnitude(spectrum);
            this.spectrums[index] = Utils.signal.voltsToMicrovolts(this.spectrums[index], true);
            console.log('this.spectrums[index]', this.spectrums[index].length);
        });
    }
    
    scaleLabels () {
        this.labels = new Array(this.bins / 2).fill()    
            .map((label, index) => {
                return Math.ceil(index * (this.sampleRate / this.bins));
            });
    }
    
    filterBands () {
        for (let band in this.bands) {
            this.byBand[band] = Utils.filter.filterBand(this.spectrums, this.labels, this.bands[band]);
        }
    }
    
    filterLabels () {
        // Skip every 8, add uni (too many labels issue)
        this.labels = this.labels.map((label, index, labels) => {
            let eighth = index % constants.scale.skipLabels === 0;
            let last = index === (labels.length - 1);
            return eighth || last ? `${label} ${constants.units.hertz}` : ``;
        });
    }
    
    emit () {
        this.signal.io.emit(constants.events.fft, {
            data: this.spectrums,
            labels: this.labels,
            theta: this.byBand.theta.spectrums,
            delta: this.byBand.delta.spectrums,
            alpha: this.byBand.alpha.spectrums,
            beta: this.byBand.beta.spectrums,
            gamma: this.byBand.gamma.spectrums
        });
    }
    
}
   
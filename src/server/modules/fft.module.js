'use strict';

const dsp = require('dsp.js');
const Utils = require('../utils');

module.exports = class FFT {
    
    constructor ({ connector, io, signalEvent }) {
        this.connector = connector;
        this.io = io;
        this.signalEvent = signalEvent;
        this.bins = 512; // aka ~2 seconds
        this.bufferSize = 512;
        this.sampleRate = this.connector.sampleRate(); // aka 250
        this.spectrums = [[],[],[],[],[],[],[],[]];
        this.spectrumsByBand = [];
        this.labels = [];
        this.bands = {
              delta: [1, 3],
              theta: [4, 8],
              alpha: [8, 12],
              beta: [13, 30],
              gamma: [30, 100]
        };
    }
        
    listen () {
        this.signalEvent.on('bci:signal', (signals) => {        
            this.signalsToFFT(signals);
            this.scaleLabels();
            this.filterBands();
            this.filterLabels();
            this.emit(); 
        });
    }
    
    signalsToFFT (signals) {
        signals.forEach((signal, index) => {
            //signal = Utils.filter.process(signal);
            let fft = new dsp.FFT(this.bufferSize, this.sampleRate);
            fft.forward(signal);
            this.spectrums[index] = Utils.data.parseObjectAsArray(fft.spectrum);
            this.spectrums[index] = Utils.signal.voltsToMicrovolts(this.spectrums[index], true);
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
            this.spectrumsByBand[band] = Utils.filter.filterBand(this.spectrums, this.labels, this.bands[band]);
        }
    }
    
    filterLabels () {
        // Skip every 8, add uni (too many labels issue)
        this.labels = this.labels.map((label, index, labels) => {
            return (index % 8 === 0 || index === (labels.length - 1)) ? label + ' Hz' : '';
        });
    }
    
    emit () {
        this.io.emit('bci:fft', {
            data: this.spectrums,
            labels: this.labels,
            theta: this.spectrumsByBand.theta.spectrums,
            delta: this.spectrumsByBand.delta.spectrums,
            alpha: this.spectrumsByBand.alpha.spectrums,
            beta: this.spectrumsByBand.beta.spectrums,
            gamma: this.spectrumsByBand.gamma.spectrums
        });
    }
    
}
   
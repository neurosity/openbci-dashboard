'use strict';

var Fili = require('fili');

module.exports = {
    
    state: {
        BANDPASS: '1-50',
        NOTCH: '60',
        VERTSCALE: '50',
        VERTALGO: 'LOG',
        SMOOTH: '0-75',
        POLARITY: 'YES',
        MAXFREQUENCY: '60'
    },    
    
    apply (filter) {
        if (!filter) return;
        let [id, value] = filter.split(':');
        this.state[id] = value;
        console.log(filter, this.state.MAXFREQUENCY);
    },
    
    process (signal) {
        Object.keys(this.state).forEach((key) => {
            let filter = key.toLowerCase();
            if (filter in this && typeof this[filter] === 'function') {
                // @TODO: apply all filters dynamically
                //signal = this[filter](signal);
            }
        });
        signal = this.notch(signal);
        return signal;
    },
    
    highpass (signal) {
        
        var iirCalculator = new Fili.CalcCascades();
        
        var hpFilterCoeffs = iirCalculator.highpass({
            order: 4, // cascade 4 biquad filters (max: 12)
            characteristic: 'butterworth',
            Fs: 250, // sampling frequency
            Fc: 1,
            gain: 0, // gain for peak, lowshelf and highshelf
            preGain: false // adds one constant multiplication for highpass and lowpass
            // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
        });
        
        var hpFilter = new Fili.IirFilter(hpFilterCoeffs);
        
        return hpFilter.multiStep(signal);
        
    },
    
    notch (signal) {
            
        if (this.state.NOTCH === 'NONE') return signal;
        
        var notchValue = parseInt(this.state.NOTCH);
        var iirCalculator = new Fili.CalcCascades();
        var notchFilterCoeffs = iirCalculator.bandstop({
            order: 2, // cascade 3 biquad filters (max: 12)
            characteristic: 'butterworth',
            Fs: 250, // sampling frequency
            Fc: notchValue,
            F1: notchValue - 1,
            F2: notchValue + 1,
            gain: 0, // gain for peak, lowshelf and highshelf
            preGain: false // adds one constant multiplication for highpass and lowpass
            // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
        });
        
        var notchFilter = new Fili.IirFilter(notchFilterCoeffs);
        
        return notchFilter.multiStep(signal);
    },
    
    maxFrequency (signal) {
        return signal.filter((frequency) => {
            return frequency < this.state.MAXFREQUENCY;
        });
    },
    
    bandpass (signal) {
        
        // @TODO: Finish bandpass filter
        return filter;
    
        var iirCalculator = new Fili.CalcCascades();
        
        var hpFilterCoeffs = iirCalculator.highpass({
            order: 3, // cascade 3 biquad filters (max: 12)
            characteristic: 'butterworth',
            Fs: sampleRate, // sampling frequency
            Fc: 1,
            gain: 0, // gain for peak, lowshelf and highshelf
            preGain: false // adds one constant multiplication for highpass and lowpass
            // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
        });
        
        var hpFilter = new Fili.IirFilter(hpFilterCoeffs);

        var lpFilterCoeffs = iirCalculator.lowpass({
            order: 3, // cascade 3 biquad filters (max: 12)
            characteristic: 'butterworth',
            Fs: sampleRate, // sampling frequency
            Fc: 50,
            gain: 0, // gain for peak, lowshelf and highshelf
            preGain: false // adds one constant multiplication for highpass and lowpass
            // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
        });

        var lpFilter = new Fili.IirFilter(lpFilterCoeffs);
        
        // @TODO: get from state which filter to use, then return it based on state settings
    },
    
    filterBand (spectrums, labels, range) {
        if (!spectrums ) return console.log('Please provide spectrums');
        spectrums = spectrums.map(function (channel) {
            return channel.filter(function (spectrum, index) {
                return labels[index] >= range[0] && labels[index] <= range[1];
            });
        });
        spectrums = [spectrums.map(function (channel) {
            if (channel.length) {
                return channel.reduce(function (a, b) {
                        return a + b;
                    }) / channel.length;
            } else return channel;
        })];
        return {
            spectrums: spectrums,
            labels: labels
        }
    }
    
}





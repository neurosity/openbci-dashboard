'use strict';

module.exports = {
    
    voltsToMicrovolts (volts, log) {
        if (!Array.isArray(volts)) {
            volts = [volts];
        }
        return volts.map((volt) => {
            return log ? Math.log10(Math.pow(10, 6) * volt) : Math.pow(10, 6) * volt;
        });
    },
    
    offsetForGrid (amplitude, channelNumber, channelAmount = 8, scale = 1.5) {
        // @TODO: initial dataset is returning messed up values
        let scaledAmplitude = amplitude * Math.pow(10, scale);
        let offset = 2 * (channelAmount - channelNumber) - 1;
        return parseFloat(scaledAmplitude + offset);
    }
    
}
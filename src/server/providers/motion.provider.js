'use strict';

const constants = require('../constants');
const Utils = require('../utils');

module.exports = class Motion {
    
    constructor ({ io }) {
        this.io = io;
        this.auxData = [];
        this.count = 0;
    }
    
    capture ({ auxData }) {
        
        if (Utils.signal.isSimulated()) {
            this.simulate();
        } else {
            if (this.hasMotion(auxData)) {
                this.auxData = auxData;
                this.emit();
            }
        }   
             
    }
    
    hasMotion () {
        return auxData.reduce((a, b) => a + b, 0)
    }
    
    simulate () {
        this.count++;
            
        if (this.count === 10) {
            this.auxData = [
                Math.round(Math.random() * 180),
                Math.round(Math.random() * 180),
                Math.round(Math.random() * 180)
            ];
            this.count = 0;
            
            
            this.emit();
        }            
    }
    
    emit () {
        this.io.emit(constants.events.motion, {
            data: this.auxData
        });
    }
    
}

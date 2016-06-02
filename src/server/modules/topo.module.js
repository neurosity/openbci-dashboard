'use strict';

const topogrid = require('topogrid');
const Utils = require('../utils');
const constants = require('../constants');

module.exports = class Topo {
    
    constructor ({ io, signal }) {
        this.io = io;
        this.signal = signal;
        this.sampleRate = constants.signal.sampleRate;
        this.grid = [];
        this.subscribe();
    }
    
    subscribe () {
        this.signal.on(constants.events.signal, (signal) => {     
            this.signalToGrid(signal);
            this.emit();
        });
    }
    
    signalToGrid (signal) {
        
        let grid = [];
        
        signal.forEach((channel) => {
            grid.push(channel[channel.length - 1]);
        });
        
        /**
         * params: Parameters for the grid [x,y,z] where x is the min
         * of the grid, y is the Max of the grid and z is the number of points
         * x: coordinates of the data
         * y: coordinates of the data
         * grid: data = [10,0,0,0,0,0,-10,30,25]; // the data values
         */
        this.grid = topogrid.create(
            constants.topo.x, 
            constants.topo.y, 
            grid, 
            constants.topo.params
        );
    }
    
    emit () {
        this.io.emit(constants.events.topo, {
            data: this.grid
        });   
    }
    
}

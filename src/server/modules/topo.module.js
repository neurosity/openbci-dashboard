'use strict';

const topogrid = require('topogrid');

const Utils = require('../utils');

module.exports = class Topo {
    
    constructor ({ connector, io, signalEvent }) {
        this.connector = connector;
        this.io = io;
        this.signalEvent = signalEvent;
        this.sampleRate = this.connector.sampleRate();
        
        /**
         * params: Parameters for the grid [x,y,z] where x is the min of the grid, y is the
         * Max of the grid and z is the number of points
         * x: coordinates of the data
         * y: coordinates of the data
         * grid: data = [10,0,0,0,0,0,-10,30,25]; // the data values
         */
        this.params = [0,10,11];
        this.x = [3,7,2,8,0,10,3,7]; 
        this.y = [0,0,3,3,8,8,10,10];
        this.grid = [];
        this.subscribe();
    }
    
    subscribe () {
        this.signalEvent.on('bci:signal', (signal) => {     
            this.signalToGrid(signal);
            this.emit();
        });
    }
    
    signalToGrid (signal) {
        let grid = [];
        signal.forEach((channel) => {
            grid.push(channel[channel.length - 1]);
        });
        this.grid = topogrid.create(this.x, this.y, grid, this.params);
    }
    
    emit () {
        this.io.emit('bci:topo', {
            data: this.grid
        });   
    }
    
}

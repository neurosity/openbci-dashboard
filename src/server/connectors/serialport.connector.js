'use strict';

var argv = require('yargs').argv;

const OpenBCI = require('openbci-sdk');
const OpenBCIBoard = OpenBCI.OpenBCIBoard;

module.exports = class Serialport extends OpenBCIBoard {
    
    constructor (options) {
        super(options); 
    }
    
    start () { 
        return new Promise((resolve, reject) => {
            
            var onConnect = () => {
                this.on('ready', () => {
                    this.streamStart();
                    resolve();
                });
            };
            
            this.autoFindOpenBCIBoard()
                .then((portName) => {
                    if (portName) {
                        this.connect(portName).then(onConnect);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (this.isSimulated()) {
                        this.connect(OpenBCI.OpenBCIConstants.OBCISimulatorPortName)
                            .then(onConnect);
                    } else {
                        reject(error);
                    }
                });
            
         });
    }
    
    stop () {
        this.streamStop().then(() => {
            this.disconnect().then(() => {
                console.log('board disconnected');
                process.exit();
            });
        });
    }
    
    stream (callback) {
        this.on('sample', callback);
    }
    
    isSimulated () {
        return !!(argv._[0] && argv._[0] === 'simulate');
    }
    
}

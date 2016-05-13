import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
  socket: any;

  constructor(){
    this.socket = {
        url: 'http://localhost:8080',
        events: {
            fft: 'bci:fft',
            time: 'bci:time'
        }
    };  
  }
}
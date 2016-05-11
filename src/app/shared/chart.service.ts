import { Injectable } from '@angular/core';

@Injectable()
export class ChartService {

  constructor() {}
  
  getChannels (): Array<string> {
    return Array(8).fill('CH').map((item, index) => item + (index + 1));
  }
  
  getColors (): Array<any> {
    return [
      { strokeColor: 'rgba(112,185,252,1)' },
      { strokeColor: 'rgba(116,150,161,1)' },
      { strokeColor: 'rgba(162,86,178,1)' },
      { strokeColor: 'rgba(144,132,246,1)' },
      { strokeColor: 'rgba(138,219,229,1)' },
      { strokeColor: 'rgba(232,223,133,1)' },
      { strokeColor: 'rgba(148,159,177,1)' },
      { strokeColor: 'rgba(77,83,96,1)' }
    ]; 
  }

}

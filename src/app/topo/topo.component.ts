import { Component, OnInit, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { Constants } from '../shared/constants';

declare var chroma;

@Component({
  moduleId: module.id,
  selector: 'bci-topo',
  templateUrl: 'topo.component.html',
  styleUrls: ['topo.component.css'],
  providers: [Constants]
})

export class TopoComponent implements OnInit {

  socket: any;
  constructor(private constants: Constants) {
    this.socket = io(constants.socket.url);
  }
  
  private grid:Array<any> = [];
  
  ngOnInit() {    
    this.socket.on(this.constants.socket.events.topo, (data) => {
      this.grid = data.data;
    });
  }
  
  ngOnDestroy () {
    this.socket.removeListener(this.constants.socket.events.topo);
  } 
  
  getClass (index) {
    return 'topoplot-u' + index;
  }

  getColor (index, pixel, grid) {
      var min = Math.min.apply(Math, grid);
      var max = Math.max.apply(Math, grid);
      var f = chroma.scale('Spectral').domain([min, max]);
      return { 
        'background-color': f(pixel) 
      }
  }

}

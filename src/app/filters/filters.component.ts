import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Constants } from '../shared';

@Component({
  moduleId: module.id,
  selector: 'bci-filters',
  templateUrl: 'filters.component.html',
  styleUrls: ['filters.component.css'],
  providers: [Constants]
})

export class FiltersComponent {
  
  socket: any;
  
  constructor(private constants: Constants) {
    this.socket = io(this.constants.socket.url);
  }
  
  private filters: Array<any> = this.constants.filters;
  
  applyFilter (filter) {
    this.socket.emit(
      this.constants.socket.events.filter, 
      filter
    );
  } 

}

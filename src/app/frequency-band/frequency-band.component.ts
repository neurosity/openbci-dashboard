import { Component, ElementRef, OnInit, Input } from '@angular/core';
import * as io from 'socket.io-client';
import { ChartService } from '../shared';
import { CHART_DIRECTIVES } from '../shared/ng2-charts';
import { Constants } from '../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bci-frequency-band',
  templateUrl: 'frequency-band.component.html',
  styleUrls: ['frequency-band.component.css'],
  directives: [CHART_DIRECTIVES],
  providers: [ChartService, Constants]
})

export class FrequencyBandComponent implements OnInit {

  socket: any;
  constructor(private view: ElementRef, 
              private chartService: ChartService, 
              private constants: Constants) {
    this.view = view;
    this.socket = io(constants.socket.url);
  }
  
  @Input() public type:string;
  @Input() public band:string;
  @Input() public color:number;
  
  private data:Array<any> = [[]];
  private colors:Array<any>;
  private channels:Array<string> = this.chartService.getChannels();
  private options:any = this.chartService.getChartJSDefaults({
    responsive: false
  });
  
  ngOnInit() {    
    this.colors = this.chartService.getColorByIndex(this.color);
    this.socket.on(this.constants.socket.events.fft, (data) => {
      this.data = data[this.band || 'data'];
    });
  }

}

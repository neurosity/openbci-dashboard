import { Component, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { RouteSegment, ROUTER_PROVIDERS } from '@angular/router';
import * as io from 'socket.io-client';
import { ChartService } from '../shared';
import { CHART_DIRECTIVES } from '../shared/ng2-charts';
import { Constants } from '../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bci-frequency',
  templateUrl: 'frequency.component.html',
  styleUrls: ['frequency.component.css'],
  directives: [CHART_DIRECTIVES],
  providers: [ChartService, Constants, ROUTER_PROVIDERS]
})

export class FrequencyComponent implements OnInit {

  socket: any;
  constructor(private chartService: ChartService,
              private segment: RouteSegment,
              private constants: Constants) {
    this.socket = io(constants.socket.url);
    this.type = segment.getParam('type') || 'line';
    
    this.setOptions(this.type);
  }
  
  @Input() type:string;
  
  private data:Array<any> = [{ data: [], label: [] }];
  private labels:Array<any> = [];
  private colors:Array<any> = this.chartService.getColors();
  private channels:Array<string> = this.chartService.getChannels();
  private options:any;
  
  setOptions (type) {
    if (type === 'line') {
      this.options = this.chartService.getChartJSLineDefaults();
    }
    if (type === 'radar') {
      this.options = this.chartService.getChartJSRadarDefaults();
    }
  }
  
  ngOnInit() {    
    this.socket.on(this.constants.socket.events.fft, (data) => {
      this.data = [];
      data.data.forEach((dataset, index) => {
        this.data.push({
          data: dataset,
          label: this.channels[index],
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        });
      });
      this.labels = data.labels;
    });
  }
  
  ngOnDestroy () {
    this.socket.removeListener(this.constants.socket.events.fft);
  } 

}

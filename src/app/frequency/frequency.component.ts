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
    this.type = segment.getParam('type') || 'Line';
  }
  
  @Input() type:string;
  
  private data:Array<any> = [[]];
  private labels:Array<any> = [];
  private colors:Array<any> = this.chartService.getColors();
  private channels:Array<string> = this.chartService.getChannels();
  private options:any = this.chartService.getChartJSDefaults();
  
  ngOnInit() {    
    this.socket.on(this.constants.socket.events.fft, (data) => {
      this.data = data.data;
      this.labels = data.labels;
    });
  }
  
  ngOnDestroy () {
    this.socket.removeListener(this.constants.socket.events.fft);
  } 

}

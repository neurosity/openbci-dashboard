import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { RouteSegment, ROUTER_PROVIDERS } from '@angular/router';
import * as io from 'socket.io-client';
import { ChartService } from '../shared';
import { CHART_DIRECTIVES } from '../shared/ng2-charts';

@Component({
  moduleId: module.id,
  selector: 'bci-frequency',
  templateUrl: 'frequency.component.html',
  styleUrls: ['frequency.component.css'],
  directives: [CHART_DIRECTIVES],
  providers: [ChartService, ROUTER_PROVIDERS]
})

export class FrequencyComponent implements OnInit {

  socket: any;
  constructor(private view: ElementRef, 
              private chartService: ChartService,
              private segment: RouteSegment) {
    this.view = view;
    this.socket = io('http://localhost:8080');
    this.type = segment.getParam('type') || 'Line';
  }
  
  @Input() type:string;
  
  private data:Array<any> = [[]];
  private labels:Array<any> = [];
  private colors:Array<any> = this.chartService.getColors();
  private channels:Array<string> = this.chartService.getChannels();

  private options:any = {
      responsive: true,
      animation: false,
      animationSteps: 15,
      datasetStrokeWidth: 1,
      pointDot: false,
      pointDotRadius: 1,
      pointDotStrokeWidth: 0,
      datasetFill: false,
      scaleOverride: true,
      scaleStartValue: -2,
      scaleStepWidth: 1,
      scaleSteps: 6,
      barShowStroke: false,
      barValueSpacing: 1,
      barStrokeWidth: 1
  };
  
  ngOnInit() {    
    this.socket.on('bci:fft', (data) => {
      this.data = data.data;
      this.labels = data.labels;
    });
  }

}

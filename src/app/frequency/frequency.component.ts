import { Component, ElementRef, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ChartService } from '../shared';
import { CHART_DIRECTIVES } from '../shared/ng2-charts';

@Component({
  moduleId: module.id,
  selector: 'bci-frequency',
  templateUrl: 'frequency.component.html',
  styleUrls: ['frequency.component.css'],
  directives: [CHART_DIRECTIVES],
  providers: [ChartService]
})

export class FrequencyComponent implements OnInit {

  socket: any;
  constructor(private view: ElementRef, private chartService: ChartService) {
    this.view = view;
    this.socket = io('http://localhost:8080');
  }
  
  private chartType:string = 'Line';
  private chartData:Array<any> = [[]];
  private chartLabels:Array<any> = [];
  private chartColors:Array<any> = this.chartService.getColors();
  private chartSeries:Array<string> = this.chartService.getChannels();

  private chartOptions:any = {
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
      this.chartData = data.data;
      this.chartLabels = data.labels;
    });
  }

}

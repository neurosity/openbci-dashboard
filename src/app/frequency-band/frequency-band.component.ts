import { Component, ElementRef, OnInit, Input } from '@angular/core';
import * as io from 'socket.io-client';
import { ChartService } from '../shared';
import { CHART_DIRECTIVES } from '../shared/ng2-charts';

@Component({
  moduleId: module.id,
  selector: 'bci-frequency-band',
  templateUrl: 'frequency-band.component.html',
  styleUrls: ['frequency-band.component.css'],
  directives: [CHART_DIRECTIVES],
  providers: [ChartService]
})

export class FrequencyBandComponent implements OnInit {

  socket: any;
  constructor(private view: ElementRef, private chartService: ChartService) {
    this.view = view;
    this.socket = io('http://localhost:8080');
  }
  
  @Input() public type:string;
  @Input() public band:string;
  @Input() public color:number;
  
  private data:Array<any> = [[]];
  private colors:Array<any>;
  private channels:Array<string> = this.chartService.getChannels();

  private options:any = {
      responsive: false,
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
    this.colors = this.chartService.getColorByIndex(this.color);
    this.socket.on('bci:fft', (data) => {
      this.data = data[this.band || 'data'];
    });
  }

}

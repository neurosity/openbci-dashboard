import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { SmoothieChart, TimeSeries } from 'smoothie';
import { ChartService } from '../shared';
import * as io from 'socket.io-client';
import { Constants } from '../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bci-time-series',
  templateUrl: 'time-series.component.html',
  styleUrls: ['time-series.component.css'],
  providers: [ChartService, Constants]
})

export class TimeSeriesComponent implements OnInit {

  socket: any;
  constructor(private view: ElementRef, 
              private chartService: ChartService, 
              private constants: Constants) {
    this.view = view;
    this.socket = io(constants.socket.url);
    this.chartService = chartService;
  }
  
  private options = this.chartService.getChartSmoothieDefaults();
  
  private timeSeries = new SmoothieChart(this.options);
  private amplitudes = [];
  private timeline = [];
  private lines = Array(8).fill(0).map(() => new TimeSeries());
  private channels = this.chartService.getChannels();
  private colors = this.chartService.getColors();
  
  ngOnInit() {
    this.addTimeSeriesLines();
        
    this.socket.on(this.constants.socket.events.time, (data) => {
      this.amplitudes = data.amplitudes;
      this.timeline = data.timeline;
      this.appendTimeSeriesLines(data.data);
    });
  }
  
  ngOnDestroy () {
    this.socket.removeListener(this.constants.socket.events.time);
  } 
  
  ngAfterViewInit () {
    this.timeSeries.streamTo(this.view.nativeElement.querySelector('canvas'), 40);
  }
  
  addTimeSeriesLines () {
    this.lines.forEach((line, index) => {
        this.timeSeries.addTimeSeries(line, { 
          strokeStyle: this.colors[index].strokeColor 
        });
    });
  }
  
  appendTimeSeriesLines (data) {
    this.lines.forEach((line, index) => {
          data[index].forEach((amplitude) => {
              line.append(new Date().getTime(), amplitude);
          });
      });
  }

}

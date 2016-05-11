import { Component, ElementRef, OnInit } from '@angular/core';
import { SmoothieChart, TimeSeries } from 'smoothie';
import { ChartService } from '../shared';
import * as io from 'socket.io-client';

@Component({
  moduleId: module.id,
  selector: 'bci-time-series',
  templateUrl: 'time-series.component.html',
  styleUrls: ['time-series.component.css'],
  providers: [ChartService]
})

export class TimeSeriesComponent implements OnInit {

  socket: any;
  constructor(private view: ElementRef, private chartService: ChartService) {
    this.view = view;
    this.socket = io('http://localhost:8080');
    this.chartService = chartService;
  }
  
  private options = {
      millisPerLine: 3000,
      grid: {
          fillStyle: '#333333',
          strokeStyle: 'rgba(0,0,0,0.1)',
          sharpLines: false,
          verticalSections: 8,
          borderVisible: true
      },
      labels: {
          disabled: true
      },
      maxValue: 8 * 2,
      minValue: 0
  };
  
  private timeSeries = new SmoothieChart(this.options);
  private amplitudes = [];
  private timeline = [];
  private lines = Array(8).fill(0).map(() => new TimeSeries());
  private channels = this.chartService.getChannels();
  private colors = this.chartService.getColors();
  
  ngOnInit() {
    this.addTimeSeriesLines();
        
    this.socket.on('bci:time', (data) => {
      this.amplitudes = data.amplitudes;
      this.timeline = data.timeline;
      this.appendTimeSeriesLines(data.data);
    });
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

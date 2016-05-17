import { Injectable } from '@angular/core';

@Injectable()
export class ChartService {

  constructor() {}
  
  getPlotlyContourLayout (overrides: any = {}): any {
    return Object.assign({
      bargap: 0,
      autosize: true,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 0, r: 0, b: 0, t: 0 },
      xaxis: {
        autorange: true,
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false
      },
      yaxis: {
        autorange: true,
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false
      }
    }, overrides);
  }
  
  getPlotlyContourData (overrides: any = {}): any {
    return Object.assign({
      z: [],
      x: [],
      y: [],
      type: 'contour',
      colorscale: 'Jet',
      showscale: false
    }, overrides);
  }
  
  getChartJSDefaults (overrides: any = {}): any {
    return Object.assign({
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
    }, overrides);
  }
  
  getChartSmoothieDefaults (overrides: any = {}): any {
    return Object.assign({
        millisPerLine: 3000,
        grid: {
            fillStyle: '#333333',
            strokeStyle: 'rgba(0,0,0,0.1)',
            sharpLines: false,
            verticalSections: this.getChannels().length,
            borderVisible: true
        },
        labels: {
            disabled: true
        },
        maxValue: this.getChannels().length * 2,
        minValue: 0
    }, overrides);
  }
  
  getChannels (): Array<string> {
    return Array(8).fill('CH').map((item, index) => item + (index + 1));
  }
  
  getColors (): Array<any> {
    return [
      { strokeColor: 'rgba(112,185,252,1)', fillColor: 'rgba(112,185,252,1)' },
      { strokeColor: 'rgba(116,150,161,1)', fillColor: 'rgba(116,150,161,1)' },
      { strokeColor: 'rgba(162,86,178,1)', fillColor: 'rgba(162,86,178,1)' },
      { strokeColor: 'rgba(144,132,246,1)', fillColor: 'rgba(144,132,246,1)' },
      { strokeColor: 'rgba(138,219,229,1)', fillColor: 'rgba(138,219,229,1)' },
      { strokeColor: 'rgba(232,223,133,1)', fillColor: 'rgba(232,223,133,1)' },
      { strokeColor: 'rgba(148,159,177,1)', fillColor: 'rgba(148,159,177,1)' },
      { strokeColor: 'rgba(77,83,96,1)', fillColor: 'rgba(77,83,96,1)' }
    ]; 
  }
  
  getColorByIndex (index:number): Array<any> {
    return this.getColors().filter((c, i) => index === i);
  }

}

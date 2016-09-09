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
  
  getChartJSGlobalDefaults (overrides: any = {}): any {
    return Object.assign({
      responsive: true,
      animation: false,
      legend: {
        display: true,
        position: 'bottom'
      },
    }, overrides);
  }
  
  getChartJSLineDefaults (overrides: any = {}): any {
    return Object.assign({
      scales: {
        xAxes: [{
          gridLines: {
            display: true
          },
          ticks: {
            max: 4,
            min: -2,
            stepSize: 0.5
          }
        }],
        yAxes: [{
          gridLines: {
            display: true
          },
          ticks: {
            max: 4,
            min: -2,
            stepSize: 0.5
          }
        }]
      }
    }, this.getChartJSGlobalDefaults());
  }
  
  getChartJSBarDefaults (overrides: any = {}): any {
    return Object.assign({
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            max: 4,
            min: 0,
            stepSize: 0.5
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            max: 4,
            min: 0,
            stepSize: 0.5
          }
        }]
      }
    }, this.getChartJSGlobalDefaults({
      legend: {
        display: false
      }
    }));
  }
  
  getChartJSRadarDefaults (overrides: any = {}): any {
    return Object.assign({
      scale: {
        lineArc: false,
        angleLines: {
          display: true
        },
        ticks: {
          max: 4,
          min: -2,
          stepSize: 0.5,
          showLabelBackdrop: false
        }
      }
    }, this.getChartJSGlobalDefaults());
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
      { borderColor: 'rgba(112,185,252,1)', backgroundColor: 'rgba(112,185,252,1)' },
      { borderColor: 'rgba(116,150,161,1)', backgroundColor: 'rgba(116,150,161,1)' },
      { borderColor: 'rgba(162,86,178,1)', backgroundColor: 'rgba(162,86,178,1)' },
      { borderColor: 'rgba(144,132,246,1)', backgroundColor: 'rgba(144,132,246,1)' },
      { borderColor: 'rgba(138,219,229,1)', backgroundColor: 'rgba(138,219,229,1)' },
      { borderColor: 'rgba(232,223,133,1)', backgroundColor: 'rgba(232,223,133,1)' },
      { borderColor: 'rgba(148,159,177,1)', backgroundColor: 'rgba(148,159,177,1)' },
      { borderColor: 'rgba(77,83,96,1)', backgroundColor: 'rgba(77,83,96,1)' }
    ]; 
  }
  
  getColorByIndex (index: number): Array<any> {
    return this.getColors().filter((c, i) => index === i);
  }

}

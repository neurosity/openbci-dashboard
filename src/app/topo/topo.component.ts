import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import * as io from 'socket.io-client';
import { Constants } from '../shared/constants';

declare var chroma: any;
declare var Plotly: any;

@Component({
  moduleId: module.id,
  selector: 'bci-topo',
  templateUrl: 'topo.component.html',
  styleUrls: ['topo.component.css'],
  providers: [Constants]
})

export class TopoComponent implements OnInit {
  
  socket: any;
  plotElement: any;
  
  constructor(private view: ElementRef, private constants: Constants) {
    this.socket = io(constants.socket.url);
  }
    
  private data: any = {
    z: [],
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse(),
    y: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse(),
    type: 'contour',
    colorscale: 'Jet',
    contours: {
      //coloring: 'heatmap'
    }
  };
  
  private layout: any = {
    autosize: true,
    width: 600,
    height: 450,
    bargap: 0,
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
  };
  
  private options: any = {
    staticPlot: true
  };
  
  ngOnInit(): void {
    this.plotElement = this.view.nativeElement.querySelector('#topo');
    Plotly.newPlot(this.plotElement.id, [this.data], this.layout, this.options);

    this.socket.on(this.constants.socket.events.topo, (data) => {
      this.data.z = data.data; 
      Plotly.redraw(this.plotElement);
      Plotly.Plots.resize(this.plotElement);
    });
  }
  
  ngOnDestroy (): void {
    this.socket.removeListener(this.constants.socket.events.topo);
  }
  
  getRandomData (): any {
    function normal() {
        var x = 0, y = 0, rds, c;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          rds = x * x + y * y;
        } while (rds == 0 || rds > 1);
        c = Math.sqrt(-2 * Math.log(rds) / rds);
        return x * c;
    }

    var N = 2000,
        a = -1,
        b = Math.random();

    var step = (b - a) / (N - 1);
    var t = new Array(N), x = new Array(N), y = new Array(N);

    for(var i = 0; i < N; i++){
      t[i] = a + step * i;
      x[i] = (Math.pow(t[i], 3)) + (0.3 * normal() );
      y[i] = (Math.pow(t[i], 6)) + (0.3 * normal() );
    }
    
    return {
      x: x,
      y: y
    };
    
  }
  
}

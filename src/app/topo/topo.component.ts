import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import * as io from 'socket.io-client';
import { ChartService, Constants } from '../shared';

declare var chroma: any;
declare var Plotly: any;

@Component({
  moduleId: module.id,
  selector: 'bci-topo',
  templateUrl: 'topo.component.html',
  styleUrls: ['topo.component.css'],
  providers: [Constants, ChartService]
})

export class TopoComponent implements OnInit {
  
  socket: any;
  plotElement: any;
  
  constructor(private view: ElementRef, 
              private chartService: ChartService, 
              private constants: Constants) {
    this.socket = io(constants.socket.url);
  }
    
  private data: any = this.chartService.getPlotlyContourData({
    x: this.getGrid(11),
    y: this.getGrid(11)
  });
  
  private layout: any = this.chartService.getPlotlyContourLayout();
  
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
    this.socket.removeListener(
      this.constants.socket.events.topo
    );
  }
  
  getGrid (n) {
    return Array(n).fill(0).map((v, i) => i).reverse();
  }
  
}

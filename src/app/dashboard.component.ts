import { Component, OnInit } from '@angular/core';
import { TimeSeriesComponent } from './time-series';
import { FrequencyComponent } from './frequency';
import { FrequencyBandsComponent } from './frequency-bands';
import { TopoComponent } from './topo';
import { Routes, Router, ROUTER_PROVIDERS, ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'bci-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [ROUTER_PROVIDERS]
})

@Routes([
  { path: '/', component: TimeSeriesComponent },
  { path: '/time-series', component: TimeSeriesComponent },
  { path: '/frequency/line', component: FrequencyComponent },
  { path: '/frequency/radar', component: FrequencyComponent },
  { path: '/frequency/bands', component: FrequencyBandsComponent },
  { path: '/topo', component: TopoComponent }
])

export class DashboardComponent implements OnInit {
  title = 'BCI Dashboard';
  
  constructor (private router: Router) {
  }
  
  ngOnInit () {
  }
  
}

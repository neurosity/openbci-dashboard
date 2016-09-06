import { Routes, RouterModule }   from '@angular/router';

import { TimeSeriesComponent } from './time-series';
import { FrequencyComponent } from './frequency';
import { FrequencyBandsComponent } from './frequency-bands';
import { TopoComponent } from './topo';
import { MotionComponent } from './motion';

const dashboardRoutes: Routes = [
  { path: '', redirectTo: '/time-series', pathMatch: 'full' },
  { path: 'time-series', component: TimeSeriesComponent },
  { path: 'frequency/line', component: FrequencyComponent },
  { path: 'frequency/radar', component: FrequencyComponent },
  { path: 'frequency/bands', component: FrequencyBandsComponent },
  { path: 'motion', component: MotionComponent },
  { path: 'topo', component: TopoComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(dashboardRoutes);
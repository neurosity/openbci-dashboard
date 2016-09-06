import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { routing, appRoutingProviders } from './dashboard.routing';

import { DashboardComponent } from './dashboard.component';
import { FiltersComponent } from './filters';
import { TimeSeriesComponent } from './time-series';
import { FrequencyComponent } from './frequency';
import { FrequencyBandsComponent } from './frequency-bands';
import { TopoComponent } from './topo';
import { MotionComponent } from './motion';

import { CHART_DIRECTIVES } from './shared/ng2-charts';

@NgModule({
  imports: [
    BrowserModule,
    routing
  ],
  declarations: [
    DashboardComponent,
    FiltersComponent,
    TimeSeriesComponent,
    FrequencyComponent,
    FrequencyBandsComponent,
    TopoComponent,
    MotionComponent,
    CHART_DIRECTIVES
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [
    DashboardComponent
  ]
})
export class DashboardModule { }
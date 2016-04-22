import { Component } from 'angular2/core';
import { FrequencyComponent } from '../frequency/frequency.component';
import { TimeSeriesComponent } from '../time-series/time-series.component';

@Component({
    selector: 'bci-dashboard',
    templateUrl: 'app/components/dashboard/dashboard.html',
    styleUrls: ['app/components/dashboard/dashboard.css'],
    directives: [FrequencyComponent, TimeSeriesComponent]
})

export class DashboardComponent {

}
import {Component} from 'angular2/core';
import {ChartComponent} from './components/chart/chart.component'

@Component({
    selector: 'bci-visualizer',
    template: '<section><h1>BCI Visualizer</h1><bci-chart></bci-chart></section>',
    directives: [ChartComponent]
})

export class AppComponent {
    constructor () {

    }
}

import {Component} from 'angular2/core';
//import io  from 'socket.io-client';
//import Chart from 'chart.js';

declare var google: any;
declare var io: any;
declare var Chart: any;

@Component({
    selector: 'bci-chart',
    templateUrl: 'app/components/chart/chart.html'
})

export class ChartComponent {

    google: any;
    io: any;
    Chart: any;
    socket: any;
    chart: any;
    options: any;


    constructor () {
        this.io = io;
        this.socket = this.io('http://localhost:8080');
        this.Chart = Chart;

        this.chart = null;
        this.options = {
            title: 'Frequency Plot',
            curveType: 'function',
            legend: { position: 'bottom' },
            vAxis: {
                viewWindowMode:'explicit',
                viewWindow: {
                    max: 100,
                    min: 99.8
                }
            }
        };
        //this.google = google;
    }

    drawChart (data) {
        if (!data) return;
        data = google.visualization.arrayToDataTable(data);
        this.chart.draw(data, this.options);
    }

    ngAfterViewInit () {

        google.charts.load('current', {'packages':['line']});
        google.charts.setOnLoadCallback(() => {
            this.chart = new google.charts.Line(document.getElementById('chart'));
        });

        this.socket.on('openBCIFFT', (data) => {
            if (this.chart !== null) {
                this.chart.draw(google.visualization.arrayToDataTable(data));
            }
            console.log('data', data);
        });

    }
}

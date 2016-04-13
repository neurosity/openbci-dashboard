import {Component} from 'angular2/core';
// import 'io'
// import 'chart.js'

@Component({
    selector: 'bci-chart',
    templateUrl: 'app/components/chart/chart.html'
})

export class ChartComponent {


    //constructor () {
    //    this.socket = io('http://localhost:8000');
    //    this.chart = null;
    //}
    //
    //ngOnInit () {
    //
    //    var chartElement = document.getElementById('chart');
    //
    //    var chartData = {
    //        labels: [],
    //        datasets: []
    //    };
    //
    //    this.chart = new Chart(chartElement, {
    //        type: 'line',
    //        data: chartData,
    //        options: {
    //            scales: {
    //                yAxes: [{
    //                    ticks: {
    //                        display: true,
    //                        autoSkip: false,
    //                        beginAtZero: false,
    //                        min: -3,
    //                        max: 3
    //                    }
    //                 }]
    //            }
    //        }
    //    });
    //
    //    this.socket.on('openBCIFFT', (data) => {
    //
    //        console.log('data', data);
    //
    //        chartData.labels = data.labels;
    //        chartData.datasets = [];
    //        data.data.forEach(function (dataset, index) {
    //            chartData.datasets.push({
    //                label: 'Channel ' + (index + 1),
    //                data: dataset,
    //                fill: false,
    //                tension: 0,
    //            });
    //        });
    //
    //        this.chart.update();
    //    });
    //
    //}
}

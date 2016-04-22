import { Component } from 'angular2/core';
import { CHART_DIRECTIVES } from '../../services/ng2-charts';

declare var io: any;

@Component({
    selector: 'bci-dashboard',
    templateUrl: 'app/components/dashboard/dashboard.html',
    styleUrls: ['app/components/dashboard/dashboard.css'],
    directives: [CHART_DIRECTIVES]
})

export class DashboardComponent {

    socket: any;

    constructor() {
        this.socket = io('http://localhost:8080');
        this.socket.on('openBCIFFT', (data) => {
            console.log('data', data);
            this.lineChartData = data.data;
            this.lineChartLabels = data.labels;
        });
    }

    private lineChartType:string = 'Line';

    private lineChartData:Array<any> = [[]];

    private lineChartColours:Array<any> = [
        { strokeColor: 'rgba(112,185,252,1)' },
        { strokeColor: 'rgba(116,150,161,1)' },
        { strokeColor: 'rgba(162,86,178,1)' },
        { strokeColor: 'rgba(144,132,246,1)' },
        { strokeColor: 'rgba(138,219,229,1)' },
        { strokeColor: 'rgba(232,223,133,1)' },
        { strokeColor: 'rgba(148,159,177,1)' },
        { strokeColor: 'rgba(77,83,96,1)' }
    ];

    private lineChartLabels:Array<any> = [];
    private lineChartSeries:Array<any> = this.generateChannels();

    private lineChartOptions:any = {
        animation: false,
        responsive: true,
        pointDot: false,
        pointDotRadius: 1,
        pointDotStrokeWidth: 0,
        datasetFill: false,
        scaleOverride: true,
        scaleStartValue: -2,
        scaleStepWidth: 1,
        scaleSteps: 6,
        barShowStroke: false,
        barValueSpacing: 1
    };

    generateChannels () {
        return Array(8).fill('Channel ').map((item, index) => item + (index + 1));
    }

}
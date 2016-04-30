import { Component, ViewEncapsulation } from '@angular/core';

declare var io: any;
declare var SmoothieChart: any;
declare var TimeSeries: any;
declare var smoothie: any;

@Component({
    selector: 'time-series',
    templateUrl: 'app/components/time-series/time-series.html',
    encapsulation: ViewEncapsulation.None,
})

export class TimeSeriesComponent {

    socket: any;

    constructor(element: ElementRef) {

        console.log(element);

        this.channels.forEach(function (channel, i) {
            smoothie.addTimeSeries(channel, { strokeStyle: this.colors[i].strokeColor });
        });

        smoothie.streamTo(element.nativeElement.querySelector('canvas'), 40);

        this.socket = io('http://localhost:8080');
        this.socket.on('bci:time', (data) => {
            updateTimeSeries(data);
        });
    }

    updateTimeSeries (data) {
        this.amplitudes = data.amplitudes;
        this.timeline = data.timeline;

        this.channels.forEach(function (channel, channelNumber) {
            data.data[channelNumber].forEach(function (amplitude) {
                channel.append(new Date().getTime(), amplitude);
            });
        });
    }

    private channels: Array<any> = Array(8).fill().map(function () {
        return new TimeSeries();
    });

    private colors: Array<any> = [
        { strokeColor: 'rgba(112,185,252,1)' },
        { strokeColor: 'rgba(116,150,161,1)' },
        { strokeColor: 'rgba(162,86,178,1)'  },
        { strokeColor: 'rgba(144,132,246,1)' },
        { strokeColor: 'rgba(138,219,229,1)' },
        { strokeColor: 'rgba(232,223,133,1)' },
        { strokeColor: 'rgba(148,159,177,1)' },
        { strokeColor: 'rgba(182,224,53,1)'  }
    ];

    private smoothie: any = new SmoothieChart({
        millisPerLine: 3000,
        grid: {
            fillStyle: '#333333',
            strokeStyle: 'rgba(255,255,255,0.05)',
            sharpLines: false,
            verticalSections: this.channels.length,
            borderVisible: true
        },
        labels: {
            disabled: true
        },
        maxValue: this.channels.length * 2,
        minValue: 0
    });


}
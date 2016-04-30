System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var TimeSeriesComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            TimeSeriesComponent = (function () {
                function TimeSeriesComponent(element) {
                    this.channels = Array(8).fill().map(function () {
                        return new TimeSeries();
                    });
                    this.colors = [
                        { strokeColor: 'rgba(112,185,252,1)' },
                        { strokeColor: 'rgba(116,150,161,1)' },
                        { strokeColor: 'rgba(162,86,178,1)' },
                        { strokeColor: 'rgba(144,132,246,1)' },
                        { strokeColor: 'rgba(138,219,229,1)' },
                        { strokeColor: 'rgba(232,223,133,1)' },
                        { strokeColor: 'rgba(148,159,177,1)' },
                        { strokeColor: 'rgba(182,224,53,1)' }
                    ];
                    this.smoothie = new SmoothieChart({
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
                    console.log(element);
                    this.channels.forEach(function (channel, i) {
                        smoothie.addTimeSeries(channel, { strokeStyle: this.colors[i].strokeColor });
                    });
                    smoothie.streamTo(element.nativeElement.querySelector('canvas'), 40);
                    this.socket = io('http://localhost:8080');
                    this.socket.on('bci:time', function (data) {
                        updateTimeSeries(data);
                    });
                }
                TimeSeriesComponent.prototype.updateTimeSeries = function (data) {
                    this.amplitudes = data.amplitudes;
                    this.timeline = data.timeline;
                    this.channels.forEach(function (channel, channelNumber) {
                        data.data[channelNumber].forEach(function (amplitude) {
                            channel.append(new Date().getTime(), amplitude);
                        });
                    });
                };
                TimeSeriesComponent = __decorate([
                    core_1.Component({
                        selector: 'time-series',
                        templateUrl: 'app/components/time-series/time-series.html',
                        encapsulation: core_1.ViewEncapsulation.None,
                    }), 
                    __metadata('design:paramtypes', [Object])
                ], TimeSeriesComponent);
                return TimeSeriesComponent;
            }());
            exports_1("TimeSeriesComponent", TimeSeriesComponent);
        }
    }
});
//# sourceMappingURL=time-series.component.js.map
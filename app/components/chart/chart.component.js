System.register(['angular2/core'], function(exports_1, context_1) {
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
    var ChartComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ChartComponent = (function () {
                function ChartComponent() {
                    this.io = io;
                    this.socket = this.io('http://localhost:8080');
                    this.Chart = Chart;
                    this.chart = null;
                    this.options = {
                        title: 'Frequency Plot',
                        curveType: 'function',
                        legend: { position: 'bottom' },
                        vAxis: {
                            viewWindowMode: 'explicit',
                            viewWindow: {
                                max: 100,
                                min: 99.8
                            }
                        }
                    };
                    //this.google = google;
                }
                ChartComponent.prototype.drawChart = function (data) {
                    if (!data)
                        return;
                    data = google.visualization.arrayToDataTable(data);
                    this.chart.draw(data, this.options);
                };
                ChartComponent.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    google.charts.load('current', { 'packages': ['line'] });
                    google.charts.setOnLoadCallback(function () {
                        _this.chart = new google.charts.Line(document.getElementById('chart'));
                    });
                    this.socket.on('openBCIFFT', function (data) {
                        if (_this.chart !== null) {
                            _this.chart.draw(google.visualization.arrayToDataTable(data));
                        }
                        console.log('data', data);
                    });
                };
                ChartComponent = __decorate([
                    core_1.Component({
                        selector: 'bci-chart',
                        templateUrl: 'app/components/chart/chart.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], ChartComponent);
                return ChartComponent;
            }());
            exports_1("ChartComponent", ChartComponent);
        }
    }
});
//# sourceMappingURL=chart.component.js.map
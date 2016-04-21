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
                    this.socket = io('http://localhost:8080');
                    this.chart = null;
                }
                ChartComponent.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    var chartElement = document.getElementById('chart');
                    var chartData = {
                        labels: [],
                        datasets: []
                    };
                    this.chart = new Chart(chartElement, {
                        type: 'line',
                        data: chartData,
                        options: {
                            scales: {
                                yAxes: [{
                                        ticks: {
                                            display: true,
                                            autoSkip: false,
                                            beginAtZero: false,
                                            min: -3,
                                            max: 3
                                        }
                                    }]
                            }
                        }
                    });
                    this.socket.on('openBCIFFT', function (data) {
                        console.log('data', data);
                        chartData.labels = data.labels;
                        chartData.datasets = [];
                        data.data.forEach(function (dataset, index) {
                            chartData.datasets.push({
                                label: 'Channel ' + (index + 1),
                                data: dataset,
                                fill: false,
                                tension: 0,
                            });
                        });
                        _this.chart.update();
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
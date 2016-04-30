System.register(['@angular2/core', '../../services/ng2-charts'], function(exports_1, context_1) {
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
    var core_1, ng2_charts_1;
    var FrequencyComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ng2_charts_1_1) {
                ng2_charts_1 = ng2_charts_1_1;
            }],
        execute: function() {
            FrequencyComponent = (function () {
                function FrequencyComponent() {
                    var _this = this;
                    this.lineChartType = 'Line';
                    this.lineChartData = [[]];
                    this.lineChartColours = [
                        { strokeColor: 'rgba(112,185,252,1)' },
                        { strokeColor: 'rgba(116,150,161,1)' },
                        { strokeColor: 'rgba(162,86,178,1)' },
                        { strokeColor: 'rgba(144,132,246,1)' },
                        { strokeColor: 'rgba(138,219,229,1)' },
                        { strokeColor: 'rgba(232,223,133,1)' },
                        { strokeColor: 'rgba(148,159,177,1)' },
                        { strokeColor: 'rgba(77,83,96,1)' }
                    ];
                    this.lineChartLabels = [];
                    this.lineChartSeries = this.generateChannels();
                    this.lineChartOptions = {
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
                    this.socket = io('http://localhost:8080');
                    this.socket.on('bci:fft', function (data) {
                        console.log('fft:data', data);
                        _this.lineChartData = data.data;
                        _this.lineChartLabels = data.labels;
                    });
                }
                FrequencyComponent.prototype.generateChannels = function () {
                    return Array(8).fill('Channel ').map(function (item, index) { return item + (index + 1); });
                };
                FrequencyComponent = __decorate([
                    core_1.Component({
                        selector: 'frequency',
                        templateUrl: 'app/components/frequency/frequency.html',
                        encapsulation: core_1.ViewEncapsulation.None,
                        directives: [ng2_charts_1.CHART_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], FrequencyComponent);
                return FrequencyComponent;
            }());
            exports_1("FrequencyComponent", FrequencyComponent);
        }
    }
});
//# sourceMappingURL=frequency.component.js.map
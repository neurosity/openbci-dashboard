
(function () {

    angular.module('bciDashboard')
        .directive('bciTimeSeries', bciTimeSeries);

    function bciTimeSeries() {

        var timeSeries = new SmoothieChart({
            millisPerLine: 3000,
            grid: {
                fillStyle: '#333333',
                strokeStyle: 'rgba(0,0,0,0.1)',
                sharpLines: false,
                verticalSections: 8,
                borderVisible: true
            },
            labels: {
                disabled: true
            },
            maxValue: 8 * 2,
            minValue: 0
        });

        return {
            templateUrl: 'components/time-series/time-series.html',
            scope: {
                eventName: '@'
            },
            bindToController: true,
            controllerAs: '$ctrl',
            controller: function ($timeout) {

                var $ctrl = this;

                var socket = io();

                $ctrl.colors = [
                    { strokeColor: 'rgba(112,185,252,1)' },
                    { strokeColor: 'rgba(116,150,161,1)' },
                    { strokeColor: 'rgba(162,86,178,1)'  },
                    { strokeColor: 'rgba(144,132,246,1)' },
                    { strokeColor: 'rgba(138,219,229,1)' },
                    { strokeColor: 'rgba(232,223,133,1)' },
                    { strokeColor: 'rgba(148,159,177,1)' },
                    { strokeColor: 'rgba(182,224,53,1)'  }
                ];

                $ctrl.channels = ['CH1','CH2','CH3','CH4','CH5','CH6','CH7','CH8'];

                // Construct time series array with 8 lines
                var lines = Array(8).fill().map(function () {
                    return new TimeSeries();
                });

                lines.forEach(function (line, index) {
                    timeSeries.addTimeSeries(line, { strokeStyle: $ctrl.colors[index].strokeColor });
                });

                socket.on($ctrl.eventName, function (data) {

                    $timeout(function () {
                        $ctrl.amplitudes = data.amplitudes;
                        $ctrl.timeline = data.timeline;
                    });

                    lines.forEach(function (line, index) {
                        data.data[index].forEach(function (amplitude) {
                            line.append(new Date().getTime(), amplitude);
                        });
                    });

                });

                $ctrl.$onDestroy = function () {
                    socket.removeListener($ctrl.eventName);
                };

            },
            link: function (scope, element) {
                // 200 = 50 samples * 4 milliseconds (sample rate)
                timeSeries.streamTo(element[0].querySelector('canvas'), 40);
            }
        }
    }

})();


angular.module('bciDashboard')
    .directive('bciTimeSeries', function () {
        return {
            templateUrl: 'components/time-series/time-series.html',
            scope: {
                eventName: '@'
            },
            link: function (scope, element) {

                var socket = io();

                var colors = [
                    { strokeColor: 'rgba(112,185,252,1)' },
                    { strokeColor: 'rgba(116,150,161,1)' },
                    { strokeColor: 'rgba(162,86,178,1)'  },
                    { strokeColor: 'rgba(144,132,246,1)' },
                    { strokeColor: 'rgba(138,219,229,1)' },
                    { strokeColor: 'rgba(232,223,133,1)' },
                    { strokeColor: 'rgba(148,159,177,1)' },
                    { strokeColor: 'rgba(182,224,53,1)'  }
                ];

                // Construct time series array with 8 channels
                var channels = Array(8).fill().map(function () {
                    return new TimeSeries();
                });

                var smoothie = new SmoothieChart({
                    millisPerLine: 3000,
                    grid: {
                        fillStyle: '#333333',
                        strokeStyle: 'rgba(0,0,0,0.1)',
                        sharpLines: false,
                        verticalSections: channels.length,
                        borderVisible: true
                    },
                    labels: {
                        disabled: true
                    },
                    maxValue: channels.length * 2,
                    minValue: 0
                });

                // 200 = 50 samples * 4 milliseconds (sample rate)
                smoothie.streamTo(element[0].querySelector('canvas'), 40);

                channels.forEach(function (channel, i) {
                    smoothie.addTimeSeries(channel, { strokeStyle: colors[i].strokeColor });
                });


                socket.on(scope.eventName, function (data) {

                    scope.$evalAsync(function () {
                        scope.amplitudes = data.amplitudes;
                        scope.timeline = data.timeline;
                    });

                    channels.forEach(function (channel, channelNumber) {
                        data.data[channelNumber].forEach(function (amplitude) {
                            channel.append(new Date().getTime(), amplitude);
                        });
                    });
                });

                scope.$onDestroy = function () {
                    socket.removeListener(scope.eventName);
                };

            }
        }
    });

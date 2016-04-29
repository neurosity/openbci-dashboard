
angular.module('bciDashboard')
    .directive('bciTimeSeries', function () {
        return {
            template: '<canvas id="timeSeries" width="600" height="400"></canvas>',
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

                var smoothie = new SmoothieChart();
                smoothie.streamTo(element[0].firstChild, 400);

                // Construct time series array with 8 channels
                var channels = Array(8).fill().map(function () {
                    return new TimeSeries();
                });

                channels.forEach(function (channel, i) {
                    smoothie.addTimeSeries(channel, { strokeStyle: colors[i].strokeColor });
                });

                socket.on(scope.eventName, function (data) {
                    console.log(data.data);
                    channels.forEach(function (channel, i) {
                        channels[i].append(new Date().getTime(), data.data[i][0]);
                    });
                });

                scope.$onDestroy = function () {
                    socket.removeListener(scope.eventName);
                };

            }
        }
    });

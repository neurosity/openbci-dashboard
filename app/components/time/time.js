
angular.module('openbciVisualizer')
    .component('bciTime', {
        templateUrl: 'components/time/time.html',
        controller: function ($timeout) {
            var $ctrl = this;
            var socket = io();
            $ctrl.colors = [
                { strokeColor: 'rgba(112,185,252,1)' },
                { strokeColor: 'rgba(116,150,161,1)' },
                { strokeColor: 'rgba(162,86,178,1)' },
                { strokeColor: 'rgba(144,132,246,1)' },
                { strokeColor: 'rgba(138,219,229,1)' },
                { strokeColor: 'rgba(232,223,133,1)' },
                { strokeColor: 'rgba(148,159,177,1)' },
                { strokeColor: 'rgba(77,83,96,1)' }
            ];
            $ctrl.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];
            socket.on('bci:time', function (data) {
                $timeout(function () {
                    console.log(data);
                    $ctrl.labels = data.labels;
                    $ctrl.data = data.data;
                });
            });
        }
    });

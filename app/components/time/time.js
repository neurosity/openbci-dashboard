
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
                { strokeColor: 'rgba(182,224,53,1)' }
            ];
            $ctrl.options = {
                animation: false,
                responsive: true,
                showScale: false,
                scaleOverride: true,
                scaleStartValue: -500,
                scaleStepWidth: 1,
                scaleSteps: 700
            };
            socket.on('bci:time', function (data) {
                $timeout(function () {
                    console.log('time data', data.data);
                    $ctrl.labels = data.labels;
                    $ctrl.data = data.data;
                });
            });
        }
    });

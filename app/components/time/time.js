
angular.module('bciDashboard')
    .component('bciTime', {
        templateUrl: 'components/time/time.html',
        bindings: {
            eventName: '@'
        },
        controller: function ($timeout) {

            var $ctrl = this;

            var socket = io();

            var eventName = 'bci:time';

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

            socket.on($ctrl.eventName, function (data) {
                $timeout(function () {
                    $ctrl.labels = data.labels;
                    $ctrl.data = data.data;
                });
            });

            $ctrl.$onDestroy = function () {
                socket.removeListener($ctrl.eventName);
            };

        }
    });


(function () {

    var BCIFrequency = {
        templateUrl: 'components/frequency/frequency.html',
        bindings: {
            type: '@',
            eventName: '@'
        },
        controller: function ($timeout) {

            var $ctrl = this;

            // Default chart type as fallback
            $ctrl.type = $ctrl.type || 'Line';

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
                responsive: true,
                animation: true,
                animationSteps: 15
            };

            $ctrl.series = ['CH1','CH2','CH3','CH4','CH5','CH6','CH7','CH8'];

            socket.on($ctrl.eventName, function (data) {
                $timeout(function () {
                    $ctrl.data = data.data;
                    $ctrl.labels = data.labels;
                });
            });

            $ctrl.$onDestroy = function () {
                socket.removeListener($ctrl.eventName);
            };

        }
    };

    angular.module('bciDashboard')
        .component('bciFrequency', BCIFrequency);

})();

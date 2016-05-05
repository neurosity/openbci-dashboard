
(function () {

    var BCIFrequencyBand = {
        templateUrl: 'components/frequency-band/frequency-band.html',
        bindings: {
            type: '@',
            color: '@',
            eventName: '@'
        },
        controller: function ($timeout) {

            var $ctrl = this;

            var socket = io();
            
            $ctrl.colors = [
                { fillColor: 'rgba(112,185,252,1)' },
                { fillColor: 'rgba(116,150,161,1)' },
                { fillColor: 'rgba(162,86,178,1)' },
                { fillColor: 'rgba(144,132,246,1)' },
                { fillColor: 'rgba(138,219,229,1)' },
                { fillColor: 'rgba(232,223,133,1)' },
                { fillColor: 'rgba(148,159,177,1)' },
                { fillColor: 'rgba(182,224,53,1)' }
            ].filter(function (color, index) {
               return parseInt($ctrl.color) === index;
            });
            
            console.log($ctrl.type, $ctrl.colors);

            $ctrl.channels = ['CH1','CH2','CH3','CH4','CH5','CH6','CH7','CH8'];

            $ctrl.options = {
                responsive: true,
                animation: true,
                animationSteps: 15
            };

            socket.on($ctrl.eventName, function (data) {
                $timeout(function () {
                    $ctrl.labels = data.labels;
                    $ctrl.data = data[$ctrl.type || 'data'];
                });
            });

            $ctrl.$onDestroy = function () {
                socket.removeListener($ctrl.eventName);
            };

        }
    };

    angular
        .module('bciDashboard')
        .component('bciFrequencyBand', BCIFrequencyBand);

})();

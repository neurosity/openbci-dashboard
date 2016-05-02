
(function () {

    var BCIBeta = {
        templateUrl: 'components/beta/beta.html',
        bindings: {
            eventName: '@'
        },
        controller: function ($timeout) {

            var $ctrl = this;

            var socket = io();

            $ctrl.colors = [
                { fillColor: 'rgba(138,219,229,1)' }
            ];

            $ctrl.channels = ['CH1','CH2','CH3','CH4','CH5','CH6','CH7','CH8'];

            $ctrl.options = {
                responsive: true,
                animation: true,
                animationSteps: 15
            };

            socket.on($ctrl.eventName, function (data) {
                $timeout(function () {
                    $ctrl.labels = data.labels;
                    $ctrl.data = data.beta;
                });
            });

            $ctrl.$onDestroy = function () {
                socket.removeListener($ctrl.eventName);
            };

        }
    };

    angular.module('bciDashboard')
        .component('bciBeta', BCIBeta);

})();
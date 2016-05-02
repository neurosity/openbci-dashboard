
(function () {

    var BCITheta = {
        templateUrl: 'components/theta/theta.html',
        bindings: {
            eventName: '@'
        },
        controller: function ($timeout) {

            var $ctrl = this;

            var socket = io();

            $ctrl.colors = [
                { fillColor: 'rgba(144,132,246,1)' }
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
                    $ctrl.data = data.theta;
                });
            });

            $ctrl.$onDestroy = function () {
                socket.removeListener($ctrl.eventName);
            };

        }
    };

    angular.module('bciDashboard')
        .component('bciTheta', BCITheta);

})();
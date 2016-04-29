
angular.module('bciDashboard')
    .component('bciAlpha', {
        templateUrl: 'components/alpha/alpha.html',
        bindings: {
            eventName: '@'
        },
        controller: function ($timeout) {

            var $ctrl = this;
            var socket = io();

            $ctrl.colors = [
                { fillColor: 'rgba(112,185,252,1)' }
            ];

            $ctrl.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];

            $ctrl.options = {
                responsive: true,
                animation: true,
                animationSteps: 15
            };

            socket.on($ctrl.eventName, function (data) {
                $timeout(function () {
                    $ctrl.labels = data.labels;
                    $ctrl.data = data.alpha;
                });
            });

            $ctrl.$onDestroy = function () {
                socket.removeListener($ctrl.eventName);
            };

        }
    });

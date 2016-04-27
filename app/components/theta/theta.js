
angular.module('bciDashboard')
    .component('bciTheta', {
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

            $ctrl.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];

            $ctrl.options = {
                responsive: true,
                animation: true,
                animationSteps: 15,
                scaleOverride: true,
                scaleStartValue: -4,
                scaleStepWidth: 2,
                scaleSteps: 6
            };

            socket.on($ctrl.eventName, function (data) {
                var thetaRange = EEGSpectrumUtils.filterBand(data.data, data.labels, [4, 8]);
                $timeout(function () {
                    $ctrl.labels = thetaRange.labels;
                    $ctrl.data = thetaRange.spectrums;
                });
            });

            $ctrl.$onDestroy = function () {
                socket.removeListener($ctrl.eventName);
            };

        }
    });

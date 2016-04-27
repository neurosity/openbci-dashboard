
angular.module('bciDashboard')
    .component('bciBeta', {
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

            $ctrl.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];

            $ctrl.options = {
                responsive: true,
                animation: true,
                animationSteps: 15,
                scaleOverride: true,
                scaleStartValue: -4,
                scaleStepWidth: 9,
                scaleSteps: 5
            };

            socket.on($ctrl.eventName, function (data) {
                var betaRange = EEGSpectrumUtils.filterBand(data.data, data.labels, [12, 40]);
                $timeout(function () {
                    $ctrl.labels = betaRange.labels;
                    $ctrl.data = betaRange.spectrums;
                });
            });

            $ctrl.$onDestroy = function () {
                socket.removeListener($ctrl.eventName);
            };

        }
    });


angular.module('bciDashboard')
    .component('bciDelta', {
        templateUrl: 'components/delta/delta.html',
        bindings: {
            eventName: '@'
        },
        controller: function ($timeout) {

            var $ctrl = this;

            var socket = io();

            $ctrl.colors = [
                { fillColor: 'rgba(162,86,178,1)' }
            ];

            $ctrl.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];

            $ctrl.options = {
                responsive: true,
                animation: true,
                animationSteps: 15,
                scaleOverride: true,
                scaleStartValue: -4,
                scaleStepWidth: 2,
                scaleSteps: 4
            };

            socket.on($ctrl.eventName, function (data) {
                var deltaRange = EEGSpectrumUtils.filterBand(data.data, data.labels, [0.5, 4]);
                $timeout(function () {
                    $ctrl.labels = deltaRange.labels;
                    $ctrl.data = deltaRange.spectrums;
                });
            });

            $ctrl.$onDestroy = function () {
                socket.removeListener($ctrl.eventName);
            };

        }
    });

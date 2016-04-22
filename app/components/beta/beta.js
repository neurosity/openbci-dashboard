
angular.module('openbciVisualizer')
    .component('bciBeta', {
        templateUrl: 'components/beta/beta.html',
        controller: function ($timeout) {
            var $ctrl = this;
            var socket = io();
            $ctrl.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];
            socket.on('bci:fft', function (data) {
                var betaRange = EEGSpectrumUtils.filterBand(data.data, data.labels, [12, 40]);
                $timeout(function () {
                    $ctrl.labels = betaRange.labels;
                    $ctrl.data = betaRange.spectrums;
                });
            });
        }
    });

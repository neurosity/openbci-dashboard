
angular.module('openbciVisualizer')
    .component('bciTheta', {
        templateUrl: 'components/theta/theta.html',
        controller: function ($timeout) {
            var $ctrl = this;
            var socket = io();
            $ctrl.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];
            socket.on('bci:fft', function (data) {
                var thetaRange = EEGSpectrumUtils.filterBand(data.data, data.labels, [4, 8]);
                $timeout(function () {
                    $ctrl.labels = thetaRange.labels;
                    $ctrl.data = thetaRange.spectrums;
                });
            });
        }
    });

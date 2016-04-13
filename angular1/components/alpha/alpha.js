
angular.module('openbciVisualizer')
    .component('bciAlpha', {
        templateUrl: 'components/alpha/alpha.html',
        controller: function ($timeout) {
            var $ctrl = this;
            var socket = io();
            $ctrl.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];
            socket.on('openBCIFFT', function (data) {
                var alphaRange = EEGSpectrumUtils.filterBand(data.data, data.labels, [8, 12]);
                $timeout(function () {
                    $ctrl.labels = alphaRange.labels;
                    $ctrl.data = alphaRange.spectrums;
                });
            });
        }
    });

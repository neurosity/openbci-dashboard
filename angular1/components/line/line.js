
angular.module('openbciVisualizer')
    .component('bciLine', {
        bindings: {
            title: '@',
            width: '@',
            height: '@',
            range: '@',
            colors: '@',
            //data: '='
        },
        templateUrl: 'components/line/line.html',
        controller: function ($timeout) {

            var $ctrl = this;
            var socket = io();

            $ctrl.series = $ctrl.series || ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];

            if (angular.isUndefined($ctrl.data)) {

                if (angular.isDefined($ctrl.range)) {
                    var filteredRange = EEGSpectrumUtils.filterBand($ctrl.data.spectrums.data, $ctrl.data.spectrums.labels, $ctrl.range);
                }

                socket.on('openBCIData', function (data) {
                    $timeout(function () {
                        $ctrl.data = filteredRange ? filteredRange.spectrums.data : data.spectrums.data;
                        $ctrl.labels = filteredRange ? filteredRange.spectrums.labels : data.spectrums.labels;
                    });
                });
            }


        }
    });


angular.module('openbciVisualizer', ['chart.js'])
    .config(function (ChartJsProvider) {
        ChartJsProvider.setOptions({
            chartColors: ['#F7464A', '#46BFBD','#FDB45C', '#949FB1','#4D5360', '#803690','#00ADF9', '#FF0000'],
            responsive: true,
            pointDot: false,
            datasetFill: false,
            scaleOverride: true,
            scaleStartValue: -2,
            scaleStepWidth: 1,
            scaleSteps: 6
        });
    })
    .controller('frequencyCtrl', function ($scope, $timeout) {

        var socket = io();

        $scope.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];

        socket.on('openBCIFrequency', function (data) {
            $timeout(function () {
                $scope.frequencyLabels = data.labels;
                $scope.frequencyData = data.spectrums;
            });
        });

    })
    .controller('thetaBandCtrl', function ($scope, $timeout) {

        var socket = io();

        $scope.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];

        socket.on('openBCIFrequency', function (data) {
            var thetaRange = EEGSpectrumUtils.filterBand(data.spectrums, data.labels, [4, 6]);
            $timeout(function () {
                $scope.thetaLabels = thetaRange.labels;
                $scope.thetaData = thetaRange.spectrums;
            });
        });


    })
    .controller('deltaBandCtrl', function ($scope, $timeout) {

        var socket = io();

        $scope.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];

        socket.on('openBCIFrequency', function (data) {
            var deltaRange = EEGSpectrumUtils.filterBand(data.spectrums, data.labels, [0.5, 4]);
            $timeout(function () {
                $scope.deltaLabels = deltaRange.labels;
                $scope.deltaData = deltaRange.spectrums;
            });
        });


    })
    .controller('timeSeriesCtrl', function ($scope, $timeout) {

        var socket = io();
        var timeData = [[],[],[],[],[],[],[],[]];

        $scope.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];

        socket.on('openBCITimeSeries', function (data) {
            $timeout(function () {
                data.timeSeries.forEach(function (channel, index) {
                    timeData[index] = timeData[index].concat(channel);
                    if (timeData[0].length === 1300) {
                        timeData[index] = timeData[index].splice(data.samplesTotal, 0);
                        $scope.timeData = timeData;
                        console.log('timeData', $scope.timeData);
                    }
                });

            });
        });

    });

angular.module('openbciVisualizer', ['chart.js'])
    .config(function (ChartJsProvider) {
        ChartJsProvider.setOptions({
            chartColors: ['#F7464A', '#46BFBD','#FDB45C', '#949FB1','#4D5360', '#803690','#00ADF9', '#FF0000'],
            responsive: true,
            pointDot: false,
            scaleShowLabels: false,
            showScale: false,
            datasetFill: false
        });
    })
    .controller('visualizerCtrl', function ($scope, $timeout) {

        var socket = io();

        $scope.labels = new Array(128).fill().map(function (x, i) { return i });
        $scope.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];

        socket.on('openBCIFrequency', function (spectrums) {
            $timeout(function () {
                $scope.data = spectrums;
                console.log($scope.data);
            });
        });

    });
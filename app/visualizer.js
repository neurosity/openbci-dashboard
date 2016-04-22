
angular.module('openbciVisualizer', ['chart.js'])
    .config(function (ChartJsProvider) {
        ChartJsProvider.setOptions({
            responsive: true,
            pointDot: false,
            pointDotRadius : 1,
            pointDotStrokeWidth : 0,
            datasetFill: false,
            scaleOverride: true,
            scaleStartValue: -2,
            scaleStepWidth: 1,
            scaleSteps: 6,
            barShowStroke : false,
            barValueSpacing : 1
        });
    });
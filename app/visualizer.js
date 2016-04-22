
angular.module('bciDasboard', ['chart.js'])
    .config(function (ChartJsProvider) {
        ChartJsProvider.setOptions({
            animation: false,
            responsive: true,
            datasetStrokeWidth: 1,
            pointDot: false,
            pointDotRadius: 1,
            pointDotStrokeWidth: 0,
            datasetFill: false,
            scaleOverride: true,
            scaleStartValue: -2,
            scaleStepWidth: 1,
            scaleSteps: 6,
            barShowStroke: false,
            barValueSpacing: 1,
            barShowStroke: true,
            barStrokeWidth: 1,
            strokeColor: 'rgba(116,150,161,1)'
        });
    });
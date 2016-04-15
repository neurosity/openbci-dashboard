
angular.module('openbciVisualizer')
    .component('bciTime', {
        templateUrl: 'components/time/time.html',
        controller: function ($timeout) {
            var $ctrl = this;
            var socket = io();
            $ctrl.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];
            socket.on('openBCISeries', function (data) {
                $timeout(function () {
                    console.log(data);
                    $ctrl.labels = data.labels;
                    $ctrl.data = data.data;
                });
            });
        }
    });

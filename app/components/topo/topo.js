angular.module('openbciVisualizer')
    .component('bciTopo', {
        templateUrl: 'components/topo/topo.html',
        controller: function ($timeout) {
            var $ctrl = this;
            var socket = io();
            $ctrl.getClass = function(index){
              return "topoplot-u" + index
            };
            $ctrl.getColor = function(pixel,index){
              // var pixel_mapped = 255
              return {'background-color': 'rgb(' + index*2 + ',0,0)'}

            };

            // $ctrl.series = ['Channel 1','Channel 2','Channel 3','Channel 4','Channel 5','Channel 6','Channel 7','Channel 8'];
            socket.on('openBCITopo', function (data) {
                $timeout(function () {
                    $ctrl.grid= [].concat.apply([], data.data);
                    // console.log($ctrl.grid);
                    // $ctrl.labels = data.labels;
                    // $ctrl.data = data.data;
                });
            });
        }
    });

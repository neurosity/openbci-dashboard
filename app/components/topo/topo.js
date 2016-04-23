angular.module('bciDashboard')
    .component('bciTopo', {
        templateUrl: 'components/topo/topo.html',
        controller: function ($timeout) {
            var $ctrl = this;
            var socket = io();
            $ctrl.getClass = function(index){
              return 'topoplot-u' + index
            };
            $ctrl.getColor = function(index,pixel,grid){
              var min = Math.min.apply(Math,grid)
              var max = Math.max.apply(Math,grid)
              var f = chroma.scale('Spectral').domain([min,max]);
              return {'background-color': f(pixel)}

            };

            socket.on('bci:topo', function (data) {
                $timeout(function () {
                    $ctrl.grid = [].concat.apply([], data.data);

                });
            });
        }
    });

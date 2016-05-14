/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
      'socket.io-client/socket.io.js',
      'smoothie/smoothie.js',
      'chart.js/Chart.js',
      'ng2-charts/bundles/ng2-charts.js',
      'chroma-js/chroma.js',
      'plotly.js/dist/plotly.js',
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/*.js',
      'es6-shim/es6-shim.js',
      'reflect-metadata/*.js',
      'rxjs/**/*.js',
      '@angular/**/*.js'
    ]
  });
};

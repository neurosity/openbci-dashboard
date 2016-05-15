/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  'smoothie': 'vendor/smoothie/smoothie.js',
  'ng2-charts': 'vendor/ng2-charts/bundles/ng2-charts.js',
  'socket.io-client': 'vendor/socket.io-client/socket.io.js',
  'chroma-js': 'vendor/chroma-js/chroma.js',
  'plotly': 'vendor/plotly.js/dist/plotly.js',
  'phaser': 'vendor/phaser/dist/phaser.js'
};  

/** User packages configuration. */
const packages: any = {
 
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/frequency',
  'app/time-series',
  'app/nav',
  'app/frequency-bands',
  'app/frequency-band',
  'app/topo',
  'app/music-training',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });

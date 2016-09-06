import './polyfills.ts';
import 'chart.js';
import 'chroma-js';
import 'plotly.js';
import 'brainbrowser/build/brainbrowser-2.3.0/brainbrowser.surface-viewer.min';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { DashboardModule } from './app/dashboard.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DashboardModule);

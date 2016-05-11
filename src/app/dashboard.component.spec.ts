import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { DashboardComponent } from '../app/dashboard.component';

beforeEachProviders(() => [DashboardComponent]);

describe('App: DashboardComponent', () => {
  it('should create the app',
      inject([DashboardComponent], (app: DashboardComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'clitest works!\'',
      inject([DashboardComponent], (app: DashboardComponent) => {
    expect(app.title).toEqual('clitest works!');
  }));
});

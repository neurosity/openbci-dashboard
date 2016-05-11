import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { ChartService } from './chart.service';

describe('Chart Service', () => {
  beforeEachProviders(() => [ChartService]);

  it('should ...',
      inject([ChartService], (service: ChartService) => {
    expect(service).toBeTruthy();
  }));
});

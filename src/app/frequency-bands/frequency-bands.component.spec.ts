import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FrequencyBandsComponent } from './frequency-bands.component';

describe('Component: FrequencyBands', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [FrequencyBandsComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([FrequencyBandsComponent],
      (component: FrequencyBandsComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(FrequencyBandsComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(FrequencyBandsComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <bci-frequency-bands></bci-frequency-bands>
  `,
  directives: [FrequencyBandsComponent]
})
class FrequencyBandsComponentTestController {
}


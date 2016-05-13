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
import { FrequencyBandComponent } from './frequency-band.component';

describe('Component: FrequencyBand', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [FrequencyBandComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([FrequencyBandComponent],
      (component: FrequencyBandComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(FrequencyBandComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(FrequencyBandComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <bci-frequency-band></bci-frequency-band>
  `,
  directives: [FrequencyBandComponent]
})
class FrequencyBandComponentTestController {
}


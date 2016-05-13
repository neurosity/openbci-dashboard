import { Component, OnInit } from '@angular/core';
import { FrequencyBandComponent } from '../frequency-band';

@Component({
  moduleId: module.id,
  selector: 'bci-frequency-bands',
  templateUrl: 'frequency-bands.component.html',
  styleUrls: ['frequency-bands.component.css'],
  directives: [FrequencyBandComponent]
})

export class FrequencyBandsComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}

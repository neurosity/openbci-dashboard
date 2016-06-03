import { Component, OnInit, ElementRef } from '@angular/core';
import * as io from 'socket.io-client';
import { Constants } from '../shared/constants';

declare var BrainBrowser;

@Component({
  moduleId: module.id,
  selector: 'bci-motion',
  templateUrl: 'motion.component.html',
  styleUrls: ['motion.component.css'],
  providers: [Constants]
})

export class MotionComponent implements OnInit {

  socket: any;
  viewer: any;
  model: any;
  constructor(private view: ElementRef, private constants: Constants) {
    this.socket = io(constants.socket.url);
  }
  
  private rotation = [];

  ngOnInit() {
    BrainBrowser.config.set('worker_dir', 'vendor/brainbrowser/build/brainbrowser-2.3.0/workers');
    
    this.socket.on(this.constants.socket.events.motion, (data) => {
      this.rotation = data.data;
      
      if (this.model) {
        console.log(this.model);
        this.model.rotation.set(...this.rotation);
      }
    });
  }
  
  ngAfterViewInit () {
    this.viewer = BrainBrowser.SurfaceViewer.start('brainbrowser', (viewer) => {
      this.viewer = viewer;
      this.viewer.render();
      this.viewer.setWireframe(true);
      this.viewer.loadModelFromURL('app/motion/models/brain-surface.obj');

      this.viewer.addEventListener('displaymodel', (data) => {
        this.model = data.model;
        this.model.rotation.set(...this.rotation);
        this.viewer.updated = true;
        this.viewer.updateViewport();
      });
    });
  }

}

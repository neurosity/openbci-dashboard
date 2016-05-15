import { Component, OnInit, ElementRef } from '@angular/core';
import * as io from 'socket.io-client';
import { Constants } from '../shared/constants';

declare var Phaser: any;

@Component({
  moduleId: module.id,
  selector: 'bci-music-training',
  templateUrl: 'music-training.component.html',
  styleUrls: ['music-training.component.css'],
  providers: [Constants]
})
export class MusicTrainingComponent implements OnInit {

  game: any;
  phaserElement: any;
  socket: any;
  constructor(private view: ElementRef, private constants: Constants) {
    this.socket = io(constants.socket.url);
  }

  ngOnInit() {
    this.phaserElement = this.view.nativeElement.querySelector('#phaser');
    
    this.game = new Phaser.Game(480, 480, Phaser.WEBGL, this.phaserElement.id, {
        preload: this.preload, create: this.create, update: this.update
    });
    
    this.socket.on(this.constants.socket.events.time, (data) => {
      console.log('data from music component', data);
    });
  }
  
  preload () {
    this.game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    this.game.stage.backgroundColor = '#FF0000';
  }
  
  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  }
  
  update () {
    
  }

}

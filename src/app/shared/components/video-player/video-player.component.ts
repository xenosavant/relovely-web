import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPlayerComponent implements OnInit {

  @Input() url: string;
  @Input() type: string;

  constructor() { }

  ngOnInit() {

  }

}

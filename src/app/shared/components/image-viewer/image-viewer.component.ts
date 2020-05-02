import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent implements OnInit {

  @Input() imageUrl: string;
  @Output() close: EventEmitter<boolean> = new EventEmitter;

  constructor() { }

  ngOnInit() {
    console.log(this.imageUrl);

  }

  onClose() {
    this.close.emit(true);
  }

}

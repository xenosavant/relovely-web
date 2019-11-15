import { Component, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent implements OnInit {

  @Output() select: EventEmitter = new EventEmitter
  @Input() image: string

  constructor() { }

  ngOnInit() {
  }

  onSelect($event: any) {
    this.select.emit($event);
  }

}

import { Component, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent implements OnInit {

  @Output() select: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() image: string
  @Input() editable: boolean;
  @Input() mobile: boolean;


  constructor() { }

  ngOnInit() {
  }

  onSelect($event: any) {
    this.select.emit($event);
  }

}

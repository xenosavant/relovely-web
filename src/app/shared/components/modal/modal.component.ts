import { Component, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit {


  @Input() title: string;
  @Output() close: EventEmitter<any> = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }


  onClose($event: any) {
    this.close.emit($event);
  }

}

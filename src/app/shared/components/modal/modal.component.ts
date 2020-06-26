import { Component, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { OverlayService } from '@app/shared/services/overlay.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit {


  @Input() title: string;
  @Output() close: EventEmitter<any> = new EventEmitter;


  constructor(private breakpointObserver: BreakpointObserver, private overlayService: OverlayService) { }

  ngOnInit() {

  }


  onClose() {
    this.close.emit();
  }

}

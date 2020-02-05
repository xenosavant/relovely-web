import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {

  @Input() type: string;

  public primary: boolean;
  public color: string;

  constructor() { }

  ngOnInit() {
    if (this.type === 'primary') {
      this.primary = true;
    }
    this.color = this.type;
  }
}

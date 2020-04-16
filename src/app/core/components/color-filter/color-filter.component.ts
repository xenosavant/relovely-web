import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ColorFilter } from '@app/shared/interfaces/color-filter.interface';

@Component({
  selector: 'app-color-filter',
  templateUrl: './color-filter.component.html',
  styleUrls: ['./color-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorFilterComponent implements OnInit {

  @Input() colors: ColorFilter[];
  @Input() public selectedColors: string[] = [];

  @Output()
  filtersChanged: EventEmitter<string[]> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  selectColor(color: ColorFilter) {
    if (this.selectedColors.indexOf(color.key) > -1) {
      this.selectedColors.splice(this.selectedColors.indexOf(color.key), 1);
    } else {
      this.selectedColors.push(color.key);
    }
    this.filtersChanged.emit(this.selectedColors);
  }

}

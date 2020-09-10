import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { SizeFilterGroup } from '@app/shared/models/size-filter-group.model';
import { SizeFilterSelection } from '../../../shared/interfaces/size-filter-selection';

@Component({
  selector: 'app-size-filter',
  templateUrl: './size-filter.component.html',
  styleUrls: ['./size-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SizeFilterComponent implements OnChanges {

  @Input()
  filters: SizeFilterGroup[];

  @Output()
  filtersChanged: EventEmitter<SizeFilterGroup> = new EventEmitter();

  constructor(private ref: ChangeDetectorRef) { }

  ngOnChanges(changes) {
  }



  selectSize(sizes: SizeFilterGroup) {
    this.filtersChanged.emit(sizes);
  }

  track(index, group: SizeFilterGroup) {
    return `${index}-${group.id}-${group.selectedKeys.length}`;
  }
}

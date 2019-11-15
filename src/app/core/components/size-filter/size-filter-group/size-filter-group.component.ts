import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { SizeFilterGroup } from '@app/shared/models/size-filter-group.model';
import { KeyValue } from '@app/shared/interfaces/key-value.interface';

@Component({
  selector: 'app-size-filter-group',
  templateUrl: './size-filter-group.component.html',
  styleUrls: ['./size-filter-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SizeFilterGroupComponent implements OnChanges {

  @Input() group: SizeFilterGroup;

  @Output()
  select: EventEmitter<string[]> = new EventEmitter();

  constructor(private ref: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.group) {
      this.ref.markForCheck();
    }
  }

  selectFilter(filter: KeyValue) {
    if (this.group.selectedKeys.indexOf(filter.key) > -1) {
      this.group.selectedKeys.splice(this.group.selectedKeys.indexOf(filter.key), 1);
    } else {
      this.group.selectedKeys.push(filter.key);
    }
    this.select.emit(this.group.selectedKeys);
  }

}

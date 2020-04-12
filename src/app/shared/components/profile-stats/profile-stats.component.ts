import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { StatItem } from '../../models/stat-item.model';

@Component({
  selector: 'app-profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileStatsComponent implements OnInit {

  @Input() statItems: StatItem[];

  constructor() {

  }

  ngOnInit() {

  }

}

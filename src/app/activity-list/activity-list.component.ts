import { Component, OnInit, Input } from '@angular/core';

import { Activity } from '../services/api.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {
  @Input() activities: Activity[];
  @Input() showUser: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}

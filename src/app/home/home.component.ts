import { Component, OnInit } from '@angular/core';

import { ApiService, Activity } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public activities: Activity[];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.apiService.getActivities$()
      .subscribe(activities => {
        this.activities = activities;
      });
  }

}

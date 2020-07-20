import { Component, OnInit } from '@angular/core';

import { ApiService, Activity, PopularListGame } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public activities: Activity[];
  public popularListGames: PopularListGame[];

  constructor(
    private apiService: ApiService,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.apiService.getActivities$()
      .subscribe(activities => this.activities = activities.slice(0, 11));

    this.apiService.getPopularGames$()
      .subscribe(popular => this.popularListGames = popular);
  }

}

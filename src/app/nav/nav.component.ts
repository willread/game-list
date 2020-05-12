import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  responseJson: string;

  constructor(
    public auth: AuthService,
    private api: ApiService
    ) {}

  ngOnInit() {
  }

}

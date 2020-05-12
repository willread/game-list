import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServerService {
  public loggedIn: boolean = false;
  public profile$ = new Observable();
  public isAuthenticated$ = new Observable();

  constructor() { }

  public login() {}
  public logout() {}
  public getTokenSilently$() {
    return new Observable();
  }
}

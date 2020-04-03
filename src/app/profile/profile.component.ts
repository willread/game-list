import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../auth.service';
import { ApiService, ApiError } from '../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public alias = new FormControl();
  public error: ApiError;

  constructor(
    public authService: AuthService,
    public apiService: ApiService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.authService.profile$.pipe(
      tap(profile => {
        this.alias.setValue(profile.alias);
      })
    ).subscribe();
  }

  update() {
    this.apiService.updateProfile$({
      alias: this.alias.value
    }).subscribe(
      () => {
        delete this.error;
        this.alias.setErrors(null);
        this.snackBar.open(`Your alias has been updated!`, undefined, { duration: 1000 });
      },
      e => {
        this.error = e.error;
        this.alias.setErrors({incorrect: true});
      }
    );
  }
}

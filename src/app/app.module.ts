import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { Ng2SearchPipeModule, Ng2SearchPipe } from 'ng2-search-filter';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ProfileComponent } from './profile/profile.component';
import { GameSearchComponent } from './game-search/game-search.component';
import { ListComponent } from './list/list.component';
import { GameComponent } from './game/game.component';
import { FilterGamesPipe } from './pipes/filter-games.pipe';
import { SortGamesPipe } from './pipes/sort-games.pipe';
import { TimePlayedComponent } from './time-played/time-played.component';
import { UserComponent } from './user/user.component';
import { GameFilterComponent } from './game-filter/game-filter.component';
import { RelativeTimePipe } from './pipes/relative-time.pipe';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { HomeComponent } from './home/home.component';
import { SecondsToTimePipe } from './pipes/seconds-to-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ProfileComponent,
    GameSearchComponent,
    ListComponent,
    GameComponent,
    FilterGamesPipe,
    SortGamesPipe,
    TimePlayedComponent,
    UserComponent,
    GameFilterComponent,
    RelativeTimePipe,
    ActivityListComponent,
    HomeComponent,
    SecondsToTimePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    Ng2SearchPipeModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    StorageServiceModule,
    ChartsModule,

    // Material

    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  providers: [
    FilterGamesPipe,
    SortGamesPipe,
    Ng2SearchPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

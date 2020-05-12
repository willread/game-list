import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ListComponent } from './list/list.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { InterceptorService } from './services/interceptor.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'list',
    component: ListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/:id',
    component: UserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class AppRoutingModule { }

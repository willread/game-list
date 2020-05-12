import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { AuthServerService } from './services/auth-server.service'

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: AuthService, useClass: AuthServerService }
  ]
})
export class AppServerModule {}

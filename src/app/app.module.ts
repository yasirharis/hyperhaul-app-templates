import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/index';
import { NetworkModule } from '@modules/network/index';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NetworkModule,
    SharedModule,
    AppRoutingModule,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

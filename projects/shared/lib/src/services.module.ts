import { NgModule } from '@angular/core';
import { CommonService } from './services/common'
import { AuthGuard,AnonOnlyGuard } from './services/auth-guard'
import { TokenStorage } from './services/token'




@NgModule({
  providers: [
    CommonService,
    AuthGuard,
    AnonOnlyGuard,
    TokenStorage
  ]
})
export class ServiceModule {}

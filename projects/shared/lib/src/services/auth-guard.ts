import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { TokenStorage } from './token'


@Injectable()
export class AuthGuard implements CanActivate {  
  private token: any;
  constructor(    
    private router: Router,
    private tokenStorage: TokenStorage
  ) {}

  canActivate(): boolean {
    this.token = this.tokenStorage.getToken();
    if(this.token) return true 
    else {
      this.router.navigate(['login']);
        return false;
    }
  }
}

@Injectable()
export class AnonOnlyGuard implements CanActivate {
  private token: any;
  constructor(    
    private router: Router,
    private tokenStorage: TokenStorage
  ) {}

  canActivate(): boolean {
    this.token = this.tokenStorage.getToken();
    if(!this.token) return true 
    else {
      this.router.navigate(['/']);     
        return false;
    }
  }
}

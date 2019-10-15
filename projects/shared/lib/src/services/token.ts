import { Injectable } from '@angular/core';

@Injectable()
export class TokenStorage{
    tokenKey = 'jwttoken'
   getToken()
  {
    let _token = localStorage.getItem(this.tokenKey)
    return _token ? JSON.parse(_token) : undefined
  }
   setToken(any)
  {
    if(!any) return //return if nothing to set

    let _token = localStorage.getItem(this.tokenKey)
    if(_token) localStorage.removeItem(this.tokenKey)  // remove first if exist 

    localStorage.setItem(this.tokenKey,JSON.stringify(any))    
  }
   clearToken()
  {
    let _token = localStorage.getItem(this.tokenKey)
    if(_token) localStorage.removeItem(this.tokenKey)  
  }
}
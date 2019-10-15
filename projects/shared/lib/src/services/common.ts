import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup,FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';

import { Observable, Subject } from 'rxjs';
import { TokenStorage } from './token'

export interface WebSocketMessage {
  type: string
  action: string
  message: any
}
export interface token {
  access: string
  refresh: string
  user: user
}
export interface userProfile {
  gender: string
  contact: string
  dob: string
  photo: string
  photoThumbnail: string
}
export interface companyProfile {
  id: number
  address: {
    googleMapId: string
    address: string
  },
  billingAddress: string
  legalAddress: string
  uen: string
  name: string,
  photo: string,
  uenName: string,
  gstRegistered: boolean,
  email: string,
  phone: string,
  website: string
}
export interface organization {
  id: number
  code: string
  isActive: boolean,
  companyProfile: companyProfile,
  organizationType: string
}
export interface user {
  username: string
  email: string
  displayName: string
  firstName: string
  lastName: string
  profile: userProfile,
  currentOrganization: {
    organization: organization
  },
  organizations: [],
  userPermissions: []

}

export const BASE_URL = 'https://dev.hyperhaul.com'

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CommonService {

private  subscribedFeeds: {[key:string]: Subject<MessageEvent>} = {};
private  feedSubscribers: {[key:string]: number} = {};

private  _reconnect_delay = 5000;
private  _ws: WebSocket = undefined;
private  _connecting: Promise<WebSocket> = undefined;

public  token: token;

constructor(  
  public tokenStorage: TokenStorage,
  public dialog: MatDialog,
  private snackbar: MatSnackBar, 
  private router: Router
  ) {
    this.token = this.tokenStorage.getToken()  
 }

showMessage(messages, button='OK') {
  this.snackbar.open(messages ,button,{duration: 3000, panelClass: 'short-snackbar'})
}

goTo(path){
  this.router.navigate([path])
}

  validateFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateFields(control);
      }
    });
  }

  getErrorResponse(response) {
    let error: string = '';
    for (var key in response) {
      if (response.hasOwnProperty(key)) {
        error += ('[' + key + "]: " + response[key]) + '\n';
      }
    }
    return error;
  }

  showValidatorErrors(error) {
    return !error ? '' :
      error.required ? 'Required' :
        error.maxlength ? 'Invalid maximum length' :
          error.minlength ? 'Invalid minimum length' :
            error.email ? 'Invalid email' : ''
  }
 
  private async connect() {

    try {
      this._connecting = new Promise<WebSocket>( (resolve, reject) => {
        let url = `${BASE_URL}?Bearer=${this.token.access}`
        let ws = new WebSocket(url);

        ws.onmessage = (msgEv) => {
          let serverMsg: WebSocketMessage = JSON.parse(msgEv.data);
          let feed = this.subscribedFeeds[serverMsg.action];
          if (feed) {
            feed.next(serverMsg.message);
          }
        }
  
        ws.onopen = () => {
          this._connecting = undefined;
          this._ws = ws;
          resolve(ws);
        }
  
        ws.onerror = (e) => {
          this._connecting = undefined;
          this._ws = undefined;
          reject(e);
        }
  
        ws.onclose = () => {
          this._ws = undefined;
          setTimeout(async () => {
            let currentFeeds = this.getSubscribedFeeds();
            if (currentFeeds.length > 0) {
              for (let feed of currentFeeds) {
                await this._subscribeFeed(feed);
              }
            }
          }, this._reconnect_delay);
        }
      });
    } catch(e) {
      for (let feed in this.subscribedFeeds) {
        this.subscribedFeeds[feed].error(e);
      }
      this.subscribedFeeds = {};
    }
  }


  private getSubscribedFeeds(): string[] {
    let feeds = [];
    for (let feed in this.feedSubscribers) {
      if (this.feedSubscribers[feed]) feeds.push(feed);
    }
    return feeds;
  }

  private async _unsubscribeFeed(feed: string) {
    if (this.getSubscribedFeeds().length == 0 && this._ws) {
      this._ws.close();
      this._ws = undefined;
    }
  }

 private  async _subscribeFeed(action: string) {
    if (!this._ws || this._ws.readyState != WebSocket.OPEN) {
      if (!this._connecting) {
        await this.connect();
      }
      await this._connecting;
    }
  }

 private  subscribeFeed(feed: string, bufferTime?: number): Observable<MessageEvent> {
    if (this.subscribedFeeds[feed] === undefined) this.subscribedFeeds[feed] = new Subject<MessageEvent>();
    if (this.feedSubscribers[feed] === undefined) this.feedSubscribers[feed] = 0;
    return new Observable(observer => {

      let cache = {
        events: [],
        bufferTimeout: undefined
      }

      let subscription = this.subscribedFeeds[feed].subscribe(m => {
        if (bufferTime) {
          cache.events.push(m);
          if (cache.bufferTimeout === undefined) {
            cache.bufferTimeout = setTimeout(()=>{
              cache.events = [];
              cache.bufferTimeout = undefined;
            }, bufferTime)
          }
        } else {
          observer.next(m)
        }
      });

      let unsubscribeFn = () => {
        subscription.unsubscribe();
        this.feedSubscribers[feed]--;
        if (this.feedSubscribers[feed] <= 0) {
          this.feedSubscribers[feed] = 0;
          this._unsubscribeFeed(feed);
        }
      }

      if (!this.feedSubscribers[feed]) {
        this._subscribeFeed(feed).then(() => {}, err => {
          observer.error(err);
          unsubscribeFn();
        });
      }
      this.feedSubscribers[feed]++;

      return unsubscribeFn
    });
  }
  
  getSocketMessages(message){
    return this.subscribeFeed(message)
  }

}
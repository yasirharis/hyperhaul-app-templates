import { Component  } from '@angular/core';
import { CommonService } from '@modules/shared/lib/src/services/common';
import { Accounts  } from '@modules/swagger-scrapper/index'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private common: CommonService){

    }
    getToken(){
      Accounts.token_create({username: 'dummy_haulier_driver', password: 'Trial@1234'}).subscribe(
        r=> {
          this.common.tokenStorage.setToken(r.response)
          this.common.showMessage('get token succesfull')
        },
        e=>{
          let error: string = ''
          error = this.common.getErrorResponse(e.response)
          this.common.showMessage(error)
        }
      )
    }
    
    logout(){
      this.common.tokenStorage.clearToken()
      this.common.showMessage('logout succesful')
    }

    showOrganization(){
      this.common.goTo('organization')
    }

  showCustomer() {
    this.common.goTo('customer')
  }

  showContact() {
    this.common.goTo('contact')
  }
}

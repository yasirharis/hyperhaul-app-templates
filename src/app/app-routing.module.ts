import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationComponent  } from '@modules/network/lib/src/organization/organization.component';
import { CustomerComponent  } from '@modules/network/lib/src/customer/customer.component';
import { ContactComponent  } from '@modules/network/lib/src/contact/contact.component';

const routes: Routes = [
  { path: 'organization', component: OrganizationComponent},
  { path: 'customer', component: CustomerComponent },
  { path: 'contact', component: ContactComponent },
]; 



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

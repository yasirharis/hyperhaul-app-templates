import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/index'
import { OrganizationComponent } from './src/organization/organization.component';
import { CustomerComponent } from '@modules/network/lib/src/customer/customer.component';
import { ContactComponent } from '@modules/network/lib/src/contact/contact.component';


@NgModule({
    declarations: [
        OrganizationComponent, CustomerComponent, ContactComponent
    ],
    exports: [     
        OrganizationComponent, CustomerComponent, ContactComponent
    ],
    imports: [SharedModule]
})
export class NetworkModule {}
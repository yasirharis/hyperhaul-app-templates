import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { GestureConfig} from '@angular/material'
import { MaterialModule } from './src/material.module'
import { MapModule  } from './src/map.module'
import { ServiceModule } from './src/services.module'
import { FlatpickrModule,FlatpickrDefaults } from 'angularx-flatpickr';
import 'hammerjs';

@NgModule({
    exports: [     
     BrowserModule,FormsModule, ReactiveFormsModule,
        HttpClientModule, BrowserAnimationsModule, MaterialModule, MapModule,ServiceModule,
        FlatpickrModule   ],
    providers:[
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: GestureConfig
        },
        FlatpickrDefaults
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        }
    }
}
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule } from '@angular/forms'

import { BrowserAnimationsModule  } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { LogComponent } from './log/log.component';
import { AdComponent } from './ad/ad.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    LogComponent,
    AdComponent,
    MapComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule, 
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

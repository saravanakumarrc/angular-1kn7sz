import { NgModule }      from '@angular/core';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import 'hammerjs';

import { AppComponent }   from './app.component';
import { ShopSearchComponent }   from './search.component';

@NgModule({
  imports:      [ BrowserModule, BrowserAnimationsModule, DropDownsModule ],
  declarations: [ AppComponent, ShopSearchComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }

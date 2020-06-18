import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';

import { SettingsModule } from './settings';
import { StaticModule } from './static';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { LookupService } from './shared/services/lookup/lookup.service';
import { RouterModule } from '@angular/router';
import { ProductModule } from './modules/product/product.module';
import { NavigationService } from './shared/services/navigation/navigation.service';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from '@angular/material';
import { DragulaModule } from 'ng2-dragula';
import { PortalModule } from '@angular/cdk/portal';
import { CloudinaryModule, CloudinaryConfiguration } from './../../node_modules/@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { environment } from '@env/environment';
import { FilterService } from './shared/services/filter/filter.service';
import { NgxStripeModule } from 'ngx-stripe';
export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

export const config: CloudinaryConfiguration = { cloud_name: environment.cloudinaryCloudName };

@NgModule({
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    PortalModule,

    // core & shared
    CoreModule,
    SharedModule,
    MatButtonModule,

    // feature
    ProductModule,
    DragulaModule.forRoot(),
    CloudinaryModule.forRoot(cloudinaryLib, config),
    NgxStripeModule.forRoot(environment.stripePublishableKey),
  ],
  exports: [RouterModule],
  declarations: [AppComponent],
  providers: [LookupService, NavigationService, FilterService],
  bootstrap: [AppComponent]
})
export class AppModule { }

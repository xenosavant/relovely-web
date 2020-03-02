import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';

import { SettingsModule } from './settings';
import { StaticModule } from './static';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { CategoryService } from './shared/services/category.service';
import { RouterModule } from '@angular/router';
import { ProductModule } from './modules/product/product.module';
import { NavigationService } from './shared/services/navigation.service';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from '@angular/material';
import { DragulaModule } from 'ng2-dragula';
import { PortalModule } from '@angular/cdk/portal';
import { CloudinaryModule, Cloudinary } from '@cloudinary/angular-5.x';
import { environment } from '@env/environment';
export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

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
    CloudinaryModule.forRoot(cloudinaryLib, { cloud_name: environment.cloudinaryCloudName, upload_preset: environment.cloudinaryUploadPreset })
  ],
  exports: [RouterModule],
  declarations: [AppComponent],
  providers: [CategoryService, NavigationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

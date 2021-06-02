import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { LookupService } from './shared/services/lookup/lookup.service';
import { RouterModule } from '@angular/router';
import { ProductModule } from './modules/product/product.module';
import { NavigationService } from './shared/services/navigation/navigation.service';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { DragulaModule } from 'ng2-dragula';
import { PortalModule } from '@angular/cdk/portal';
import { environment } from '@env/environment';
import { FilterService } from './shared/services/filter/filter.service';
import { NgxStripeModule } from 'ngx-stripe';
import { APP_INITIALIZER, ErrorHandler } from "@angular/core";
import * as Sentry from "@sentry/angular";
import { Router } from "@angular/router";

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
    NgxStripeModule.forRoot(environment.stripePublishableKey),
  ],
  exports: [RouterModule],
  declarations: [AppComponent],
  providers: [LookupService, NavigationService, FilterService, {
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler({
      showDialog: false,
    }),
  },
    {
      provide: Sentry.TraceService,
      deps: [Router],
      useValue: undefined
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => { },
      deps: [Sentry.TraceService],
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

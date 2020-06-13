import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer
} from '@ngrx/router-store';

import { environment } from '@env/environment';

import { httpInterceptorProviders } from './http-interceptors';
import { LocalStorageService } from './local-storage/local-storage.service';
import { AppErrorHandler } from './error-handler/app-error-handler.service';
import { CustomSerializer } from './router/custom-serializer';
import { NotificationService } from './notifications/notification.service';
import { GoogleAnalyticsEffects } from './google-analytics/google-analytics.effects';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SharedModule } from '@app/shared';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CoreRoutingModule } from './core-routing.module';
import { RouterModule } from '@angular/router';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { SizeFilterComponent } from './components/size-filter/size-filter.component';
import { ColorFilterComponent } from './components/color-filter/color-filter.component';
import { SizeFilterGroupComponent } from './components/size-filter/size-filter-group/size-filter-group.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,
    SharedModule
  ],
  declarations: [SearchBarComponent, ToolbarComponent, HomeComponent, NotFoundComponent, FilterBarComponent, SizeFilterComponent, ColorFilterComponent, SizeFilterGroupComponent, AboutComponent],
  providers: [
    NotificationService,
    httpInterceptorProviders
  ],
  exports: [SearchBarComponent, ToolbarComponent, RouterModule, FilterBarComponent]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}

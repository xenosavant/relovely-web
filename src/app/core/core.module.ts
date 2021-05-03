import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { httpInterceptorProviders } from './http-interceptors';
import { NotificationService } from './notifications/notification.service';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SharedModule } from '@app/shared';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { SizeFilterComponent } from './components/size-filter/size-filter.component';
import { ColorFilterComponent } from './components/color-filter/color-filter.component';
import { SizeFilterGroupComponent } from './components/size-filter/size-filter-group/size-filter-group.component';
import { AboutComponent } from './components/about/about.component';
import { PortalModule } from '@angular/cdk/portal';
import { HelpComponent } from './components/help/help.component';
import { ContactComponent } from './components/contact/contact.component';

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,
    SharedModule,
    PortalModule
  ],
  declarations: [SearchBarComponent, ToolbarComponent, HomeComponent, NotFoundComponent, FilterBarComponent, SizeFilterComponent, ColorFilterComponent, SizeFilterGroupComponent, AboutComponent, HelpComponent, ContactComponent],
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

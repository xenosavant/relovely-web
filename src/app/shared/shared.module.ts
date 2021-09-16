import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ClickOutsideModule } from 'ng-click-outside';
import { FileUploadModule } from 'ng2-file-upload';
import { AvatarComponent } from './components/avatar/avatar.component';
import { HorizontalProductListComponent } from './components/horizontal-product-list/horizontal-product-list.component';
import { ButtonComponent } from './components/button/button.component';
import { ProductBodyComponent } from './components/product-body/product-body.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileStatsComponent } from './components/profile-stats/profile-stats.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ProductModule } from '@app/modules/product/product.module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { FakeSlidesDirective } from './directives/fake-slides.directive';
import { ClickDirective } from './directives/click.directive';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ModalComponent } from './components/modal/modal.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { CenterModalComponent } from './components/center-modal/center-modal.component';
import { AuthComponent } from './components/auth/auth.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { VideoUploaderComponent } from './components/video-uploader/video-uploader.component';
import { AddressComponent } from './components/address/address.component';
import { AppCurrencyPipe } from './pipes/currency.pipe';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { DragulaModule } from 'ng2-dragula';
import { CurrencyDirective } from './directives/currency';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { AppSizePipe } from './pipes/size.pipe';
import { AddAddressModalComponent } from './components/add-address-modal/add-address-modal.component';
import { PaymentCardInputComponent } from './components/payment-card-input/payment-card-input.component';
import { NgxStripeModule } from 'ngx-stripe';
import { VerifySellerComponent } from './components/verify-seller/verify-seller.component';
import { SsnDirective } from './directives/ssn.directive';
import { PhoneNumberDirective } from './directives/phoneNumber.directive';
import { CardComponent } from './components/card/card.component';
import { AddPaymentCardComponent } from './components/add-payment-card/add-payment-card.component';
import { AddBankComponent } from './components/add-bank/add-bank.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { HeaderDetailsComponent } from './components/header-details/header-details.component';
import { LinkFacebookComponent } from './components/link-facebook/link-facebook.component';
import { LinkInstagramComponent } from './components/link-instagram/link-instagram.component';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { SellerApplyComponent } from './components/seller-apply/seller-apply.component';
import { AuthenticationGuard } from './guards/auth.guard';
import { SellerGuard } from './guards/seller.guard';
import { AdminGuard } from './guards/admin.guard';
import { HorizontalUserListComponent } from './components/horizontal-user-list/horizontal-user-list.component';
import { AppSizesPipe } from './pipes/sizes.pipe';
import { CategoriesPipe } from './pipes/categories.pipe';
import { ProductTitlePipe } from './pipes/product-title-pipe';
import { CategoryPipe } from './pipes/category.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    ImageCropperModule,
    MatProgressSpinnerModule,
    ClickOutsideModule,
    FileUploadModule,
    DragulaModule,
    NgxStripeModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    CurrencyDirective,
    AvatarComponent,
    HorizontalProductListComponent,
    ButtonComponent,
    ProductBodyComponent,
    ProfileHeaderComponent,
    ProfileStatsComponent,
    ProductsListComponent,
    ProductListComponent,
    ClickDirective,
    SsnDirective,
    PhoneNumberDirective,
    FakeSlidesDirective,
    UserListComponent,
    UsersListComponent,
    BreadcrumbsComponent,
    ModalComponent,
    ImageCropperComponent,
    CenterModalComponent,
    AuthComponent,
    VideoPlayerComponent,
    VideoUploaderComponent,
    AddressComponent,
    AppCurrencyPipe,
    AppSizePipe,
    AppSizesPipe,
    ProductTitlePipe,
    CategoriesPipe,
    ProductCreateComponent,
    ImageViewerComponent,
    AddAddressModalComponent,
    PaymentCardInputComponent,
    VerifySellerComponent,
    CardComponent,
    AddPaymentCardComponent,
    AddBankComponent,
    OrderStatusComponent,
    HeaderDetailsComponent,
    LinkFacebookComponent,
    LinkInstagramComponent,
    AddAddressComponent,
    SellerApplyComponent,
    HorizontalUserListComponent,
    CategoryPipe],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
    MatPaginatorModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AvatarComponent,
    HorizontalProductListComponent,
    ButtonComponent,
    ProductBodyComponent,
    ProfileHeaderComponent,
    ProfileStatsComponent,
    ProductsListComponent,
    ProductListComponent,
    ProductTitlePipe,
    UserListComponent,
    UsersListComponent,
    FakeSlidesDirective,
    ClickDirective,
    CurrencyDirective,
    PhoneNumberDirective,
    SsnDirective,
    BreadcrumbsComponent,
    ModalComponent,
    ImageCropperComponent,
    CenterModalComponent,
    AuthComponent,
    VideoPlayerComponent,
    VideoUploaderComponent,
    AddressComponent,
    AppCurrencyPipe,
    AppSizePipe,
    AppSizesPipe,
    CategoriesPipe,
    ProductCreateComponent,
    ImageViewerComponent,
    AddAddressModalComponent,
    PaymentCardInputComponent,
    VerifySellerComponent,
    CardComponent,
    AddPaymentCardComponent,
    AddBankComponent,
    OrderStatusComponent,
    HeaderDetailsComponent,
    LinkFacebookComponent,
    LinkInstagramComponent,
    AddAddressComponent,
    SellerApplyComponent,
    HorizontalUserListComponent,
    CategoryPipe
  ],
  providers: [DecimalPipe, CategoriesPipe, AuthenticationGuard, SellerGuard, AdminGuard],
})
export class SharedModule { }

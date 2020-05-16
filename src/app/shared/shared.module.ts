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
import { MatSliderModule, MatPaginatorModule } from '@angular/material/';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ClickOutsideModule } from 'ng-click-outside';
import { FileUploadModule } from 'ng2-file-upload';
import { CloudinaryModule } from '../../../node_modules/@cloudinary/angular-5.x'

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faUserCircle,
  faPowerOff,
  faCog,
  faPlayCircle,
  faRocket,
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCaretUp,
  faCaretDown,
  faExclamationTriangle,
  faFilter,
  faTasks,
  faCheck,
  faSquare,
  faLanguage,
  faPaintBrush,
  faLightbulb,
  faWindowMaximize,
  faStream,
  faBook,
  faSearch,
  faShoppingCart,
  faArrowLeft,
  faHeart,
  faTh,
  faUndo,
  faWindowClose,
  faThLarge,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faMediumM,
  faTwitter,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
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
import { SignupComponent } from './components/signup/signup.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { VideoUploaderComponent } from './components/video-uploader/video-uploader.component';
import { AddressComponent } from './components/address/address.component';
import { AppCurrencyPipe } from './pipes/currency.pipe';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { DragulaModule } from 'ng2-dragula';
import { CurrencyDirective } from './directives/currency';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { AppSizePipe } from './pipes/size.pipe';
import { AddAddressComponent } from './components/add-address/add-address.component';


library.add(
  faBars,
  faUserCircle,
  faPowerOff,
  faCog,
  faRocket,
  faPlayCircle,
  faGithub,
  faMediumM,
  faTwitter,
  faInstagram,
  faYoutube,
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCaretUp,
  faCaretDown,
  faExclamationTriangle,
  faFilter,
  faTasks,
  faCheck,
  faSquare,
  faLanguage,
  faPaintBrush,
  faLightbulb,
  faWindowMaximize,
  faStream,
  faBook,
  faSearch,
  faShoppingCart,
  faArrowLeft,
  faWindowClose,
  faThLarge,
  faEllipsisV,
  faHeart,
  faUndo
);


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
    FontAwesomeModule,
    ImageCropperModule,
    MatProgressSpinnerModule,
    ClickOutsideModule,
    FileUploadModule,
    CloudinaryModule,
    DragulaModule
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
    FakeSlidesDirective,
    UserListComponent,
    UsersListComponent,
    BreadcrumbsComponent,
    ModalComponent,
    ImageCropperComponent,
    CenterModalComponent,
    SignupComponent,
    VideoPlayerComponent,
    VideoUploaderComponent,
    AddressComponent,
    AppCurrencyPipe,
    AppSizePipe,
    ProductCreateComponent,
    ImageViewerComponent,
    AddAddressComponent],
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
    FontAwesomeModule,
    AvatarComponent,
    HorizontalProductListComponent,
    ButtonComponent,
    ProductBodyComponent,
    ProfileHeaderComponent,
    ProfileStatsComponent,
    ProductsListComponent,
    ProductListComponent,
    UserListComponent,
    UsersListComponent,
    FakeSlidesDirective,
    ClickDirective,
    CurrencyDirective,
    BreadcrumbsComponent,
    ModalComponent,
    ImageCropperComponent,
    CenterModalComponent,
    SignupComponent,
    VideoPlayerComponent,
    VideoUploaderComponent,
    AddressComponent,
    AppCurrencyPipe,
    AppSizePipe,
    ProductCreateComponent,
    ImageViewerComponent,
    AddAddressComponent
  ],
  providers: [DecimalPipe],
})
export class SharedModule { }

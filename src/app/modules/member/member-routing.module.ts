import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './containers/favorites/favorites.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ListingsComponent } from './containers/listings/listings.component';
import { TermsComponent } from './containers/terms/terms.component';
import { ReviewsComponent } from './containers/reviews/reviews.component';
import { PrivacyComponent } from './containers/privacy/privacy.component';
import { SellersComponent } from './containers/sellers/sellers.component';

const routes: Routes = [
    {
        path: 'favorites',
        component: FavoritesComponent,
    },
    {
        path: 'listings',
        component: ListingsComponent,
    },
    {
        path: 'terms',
        component: TermsComponent
    },
    {
        path: 'privacy',
        component: PrivacyComponent
    },
    {
        path: 'sellers',
        component: SellersComponent,
    },
    {
        path: ':id',
        component: ProfileComponent,
    },
    {
        path: 'ratings/:id',
        component: ReviewsComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MemberRoutingModule { }

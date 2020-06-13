import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './containers/favorites/favorites.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ListingsComponent } from './containers/listings/listings.component';
import { InstagramAuthComponent } from './components/instagram-auth/instagram-auth.component';
import { TermsComponent } from './containers/terms/terms.component';
import { ReviewsComponent } from './containers/reviews/reviews.component';

const routes: Routes = [
    {
        path: 'favorites',
        component: FavoritesComponent
    },
    {
        path: 'listings',
        component: ListingsComponent
    },
    {
        path: 'terms',
        component: TermsComponent
    },
    {
        path: 'privacy',
        component: TermsComponent
    },
    {
        path: ':id',
        component: ProfileComponent
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

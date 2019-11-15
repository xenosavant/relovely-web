import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './containers/favorites/favorites.component';
import { ProfileComponent } from './containers/profile/profile.component';

const routes: Routes = [
    {
        path: 'favorites',
        component: FavoritesComponent
    },
    {
        path: ':id',
        component: ProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MemberRoutingModule { }

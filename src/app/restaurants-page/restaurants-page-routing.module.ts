import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantsPageComponent } from './restaurants-page.component';
 
const routes: Routes = [
    {   path: 'restaurants',   component: RestaurantsPageComponent   },
    {   path: 'restaurants/:type',   component: RestaurantsPageComponent   },
  ];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantsPageRoutingModule { }
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarsPageComponent } from './bars-page.component';
 
const routes: Routes = [
  {   path: 'bars',   component: BarsPageComponent   },
  {   path: 'bars/:type',   component: BarsPageComponent   },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarsPageRoutingModule { }
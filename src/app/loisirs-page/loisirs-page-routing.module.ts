import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoisirsPageComponent } from './loisirs-page.component';
 
const routes: Routes = [
  {   path: 'loisirs',   component: LoisirsPageComponent   },
  {   path: 'loisirs/:type',   component: LoisirsPageComponent   },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoisirsPageRoutingModule { }
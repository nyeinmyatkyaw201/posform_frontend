import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosformComponent } from './posform/posform.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'posform',
    pathMatch: 'full'
  },
  {
    path: 'posform',
    component: PosformComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

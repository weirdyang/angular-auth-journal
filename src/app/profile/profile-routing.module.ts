import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
{ path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
{ path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
{ path: 'posts', loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule) },
{ path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

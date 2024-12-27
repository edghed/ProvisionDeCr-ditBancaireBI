import { AuthGuard } from './utils/auth-gard';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UsersComponent } from './users/users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'users',
    component: SidebarComponent,
    children: [
      { path: '', component: UsersComponent }
    ],
    canActivate:[AuthGuard],data:{permittedRole:"ROLE_ADMIN"}
  },



  {
    path: 'dashboards',
    component: SidebarComponent,
    children: [
      { path: '', component: DashboardsComponent }
    ],canActivate:[AuthGuard]
  },

  {
    path: 'profile',
    component: SidebarComponent,
    children: [
      { path: '', component: ProfileComponent }
    ],canActivate:[AuthGuard]
  },

  {
    path: 'about',
    component: SidebarComponent,
    children: [
      { path: '', component: AboutComponent }
    ],canActivate:[AuthGuard]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

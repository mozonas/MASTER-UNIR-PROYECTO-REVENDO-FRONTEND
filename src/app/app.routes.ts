import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { WelcomeComponent } from './pages/authentication/welcome-component/welcome-component';
import {LoginComponent} from './pages/authentication/login/login.component';
import { SignupComponent } from './pages/authentication/signup/signup.component';
import { UserPageInfoComponent } from './pages/user/user-page-info/user-page-info';

export const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: "home" },
  { path: "home", component: WelcomeComponent },
  { path: "login", component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user-info', component: UserPageInfoComponent },
  {path: 'dashboard', component: DashboardComponent}
];


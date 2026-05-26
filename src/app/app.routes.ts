import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/authentication/welcome-component/welcome-component';
import {LoginComponent} from './pages/authentication/login/login.component';
import { SignupComponent } from './pages/authentication/signup/signup.component';

export const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: "home" },
  { path: "home", component: WelcomeComponent },
  { path: "login", component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];


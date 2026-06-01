import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/authentication/welcome-component/welcome-component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { SignupComponent } from './pages/authentication/signup/signup.component';
import { UserPageInfoComponent } from './pages/user/user-page-info/user-page-info';
import { HeaderMenuComponent } from './shared/headers/header-menu/header-menu.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';


export const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: "home" },
  { path: "home", component: WelcomeComponent },
  { path: "login", component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user-info', component: UserPageInfoComponent },
  { path: 'header-menu', component: HeaderMenuComponent},
  { path: 'admin-layout', component: AdminLayoutComponent},
 
];
import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/authentication/welcome-component/welcome-component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { SignupComponent } from './pages/authentication/signup/signup.component';
import { UserPageInfoComponent } from './pages/user/user-page-info/user-page-info';
import { UserPageEditComponent } from './pages/user/user-page-edit/user-page-edit';
import { authGuard } from './guards/auth.guard';

//import { roleGuard } from './guards/role.guard';


export const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: "home" },
  { path: "home", component: WelcomeComponent },
  { path: "login", component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user-info', component: UserPageInfoComponent, canActivate: [authGuard] },
  { path: 'user-edit', component: UserPageEditComponent, canActivate: [authGuard] }

  // A medida que se vayan creando los componentes de cada página, se irán añadiendo aquí con su correspondiente path y guard si es necesario
  //Habrá incluso rutas para cada rol, por ejemplo, /admin, /moderador, /usuario, etc. y se protegerán con el guard correspondiente para cada rol
  //Usaremos la línea comentada roleGuard
];
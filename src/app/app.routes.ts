import { Routes } from '@angular/router';
import { SignupComponent } from './pages/authentication/signup/signup.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: 'signup', pathMatch: 'full' }
];
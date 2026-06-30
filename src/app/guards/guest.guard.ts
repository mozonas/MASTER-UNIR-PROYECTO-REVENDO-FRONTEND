import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLogged()) { 
    // Si ya está logueado, lo redirigimos a la página principal
    router.navigate(['/home']);
    return false;
  }

  // Si no está logueado, permitimos que vea el Login/Signup/Welcome
  return true;
};
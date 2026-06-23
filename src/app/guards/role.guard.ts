import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    // 1) Si no está logueado → welcome
    if (!auth.isLogged()) {
      router.navigate(['/welcome']);
      return false;
    }

    // 2) Obtener rol endurecido
    const role = auth.getUserRole();

    // 3) Si no hay rol o no coincide → forbidden
    if (!role || !allowedRoles.includes(role)) {
      router.navigate(['/forbidden']);
      return false;
    }

    return true;
  };
};

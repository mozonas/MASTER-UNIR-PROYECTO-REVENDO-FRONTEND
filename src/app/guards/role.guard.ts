import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();
    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    const role = authService.getUserRole();

    if (!role || !allowedRoles.includes(role)) {
      router.navigate(['/forbidden']); // o donde quieras
      return false;
    }

    return true;
  };
}

/*
Este guard lo debemos usar en las rutas que queramos proteger por rol.
Habrá que crear un componente de Forbidden para mostrar un mensaje de acceso denegado o algo así,
o un 404.
Lo que decidáis, pero lo importante es que el guard redirija a alguna parte si el rol no es correcto.
Yo metería un 404 con una viñeta de Gandalf gritando al Balrog "¡No puedes pasar!" o algo así, para darle
 un toque divertido a la aplicación.
*/
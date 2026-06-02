import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(cloned);
};


// Este interceptor se encargará de añadir el token JWT a las cabeceras de todas las peticiones HTTP 
// que se hagan desde la aplicación, siempre y cuando el token esté presente en el SessionStorage.
//  De esta forma, el backend podrá validar el token y autorizar o denegar el acceso a los recursos
//  protegidos según corresponda.

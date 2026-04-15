import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');
  const rolPermitido = route.data?.['rol'] as string | undefined;

  if (!token) {
    return router.parseUrl('/login');
  }

  if (rolPermitido && rol !== rolPermitido) {
    return rol === 'empresa'
      ? router.parseUrl('/empresa')
      : router.parseUrl('/home');
  }

  return true;
};
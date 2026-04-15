import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');
  const rolPermitido = route.data?.['rol'];

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (rolPermitido && rol !== rolPermitido) {
    if (rol === 'empresa') {
      router.navigate(['/empresa']);
    } else {
      router.navigate(['/home']);
    }
    return false;
  }

  return true;
};
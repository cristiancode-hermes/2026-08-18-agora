import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as string;

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const user = auth.currentUser();
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return router.createUrlTree(['/']);
  }

  return true;
};

export const organizerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated() && auth.isOrganizer()) {
    return true;
  }

  return router.createUrlTree(['/']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated() && auth.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/']);
};

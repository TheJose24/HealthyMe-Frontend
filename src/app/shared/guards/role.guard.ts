import { Injectable } from '@angular/core';
import type { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import type { UserDTO } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];

    const userRaw = localStorage.getItem('user');
    if (!userRaw) {
      this.router.navigate(['/login']);
      return false;
    }

    const user: UserDTO = JSON.parse(userRaw);
    if (!expectedRoles.includes(user.rol)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}

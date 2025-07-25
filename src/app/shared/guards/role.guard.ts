import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import type { IUserDTO } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  public constructor(private router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];

    const userRaw = localStorage.getItem('user');
    if (!userRaw) {
      this.router.navigate(['/login']);
      return false;
    }

    const user: IUserDTO = JSON.parse(userRaw);
    if (!expectedRoles.includes(user.rol)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }
}

import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login/login.service';  

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  loginService = inject(LoginService);
  routerService = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const rol_name = this.loginService.getUserInfo()?.rol_name;
    if(!rol_name) return false;

    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles && !requiredRoles.includes(rol_name)) {
      return false;
    }
    return true;
  }
}

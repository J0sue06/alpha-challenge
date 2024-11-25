import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login/login.service';  

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  loginService = inject(LoginService);
  routerService = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const access_token = this.loginService.getToken();
    
    if (!access_token) {
      this.routerService.navigate(['/login']);
      return false;
    }
    return true;
  }
}

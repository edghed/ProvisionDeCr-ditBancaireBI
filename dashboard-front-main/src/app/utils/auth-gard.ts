import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private service : AuthServiceService, private cookieService: CookieService) {
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if ( this.cookieService.get('token') != ""){
        console.log("found token!")
      let role = next.data['permittedRole'] as string;
     console.log(role);
     // console.log(this.service.roleMatch(roles));
      if(role){
        if (this.service.roleMatch(role))
          return true;
        else{
          this.router.navigate(['/login']);
          return false;
        }
      }
      return true;
    }
    else {
      this.router.navigate(['/login']);
      return false;
    }

  }
  
}
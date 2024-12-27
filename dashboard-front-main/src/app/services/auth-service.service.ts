import { CookieService } from 'ngx-cookie-service';
import { baseUrl } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/auth/signin`, data);
  }

  roleMatch(role: string): boolean {
    var isMatch = false;
    var token = this.cookieService.get('token');
    if (token != null && token.length!=0) {
      var payLoad = JSON.parse(window.atob(token.split('.')[1]));
      var userRoles = payLoad.roles as string[];
      //console.log(payLoad.role);
      isMatch = userRoles.includes(role);
    }

    return isMatch;
  }
}

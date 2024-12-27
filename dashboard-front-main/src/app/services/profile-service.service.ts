import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../profile/models/profile-model';
import { baseUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {

  // Temporarily stores data from dialogs
  dialogData: any;

  constructor(private http: HttpClient, private cookieService: CookieService) {

  }

  updateUserProfile(profile:Profile):void{
    this.http.put(`${baseUrl}/profile/update`,profile,{responseType:"text"}).subscribe(data => {
      this.dialogData = profile;
      console.log("Successfully edited");

      //this.toasterService.showToaster('Successfully edited', 3000);
    },
    (err: HttpErrorResponse) => {
      console.error("Error when editing user profile",err);
     // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    }
  );
  }

  getUserProfile(): Observable<Profile> {
    var username = this.getUserNameFromCookie();
    if (username != "") {
      return this.http.get<Profile>(`${baseUrl}/profile/` + username);
    }
    return new Observable<Profile>();
  }

  private getUserNameFromCookie(): string {
    var token = this.cookieService.get("token");
    if (token != null && token.length != 0) {
      var payLoad = JSON.parse(window.atob(token.split('.')[1]));
      var userName = payLoad.username as string;
      return userName
    }
    return "";
  }
}

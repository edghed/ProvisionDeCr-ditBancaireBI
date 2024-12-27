import { Profile } from './../profile/models/profile-model';
import { ProfileServiceService } from './../services/profile-service.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from './../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public router: Router, public authService: AuthServiceService, private cookieService: CookieService, private profileService: ProfileServiceService) { }

  url !: string;
  data !: Profile;
  name = "John Smith";
  position = "Business Analyst"

  private dashboardUrls = [
    "/client-details",
    "/lgd",
    "/oil-forecast",
    "/portfolio-overview"
  ];

  logout() {
    this.cookieService.delete("token");
    this.router.navigateByUrl("/login");
  }

  isDashboard() {
    return this.dashboardUrls.indexOf(this.router.url) !== -1
  }

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe(result => {
      this.data = result;
      if (this.data?.picture != null) {
        this.url = this.data.picture
      }
      if (this.data?.firstName != null && this.data?.firstName.length > 0
        && this.data?.lastName != null && this.data?.lastName.length > 0
      ) {
        this.name = this.data.firstName + " " + this.data.lastName;
      }
      if (this.data?.position != null && this.data?.position.length > 0) {
        this.position = this.data.position;
      }
    })
  }

}

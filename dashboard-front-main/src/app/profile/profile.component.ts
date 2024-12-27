import { MatSnackBar } from '@angular/material/snack-bar';
import { Validators, FormControl } from '@angular/forms';
import { Profile } from './models/profile-model';
import { ProfileServiceService } from './../services/profile-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  data !: Profile;

  url !: string;

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      // read file as data url
      console.log(event.target.files[0])
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }
  }

  public delete() {
    this.url = "";
  }

  constructor(private profileService: ProfileServiceService,public snackbar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe(result => {
      this.data = result;
      if (this.data?.picture != null) {
        this.url = this.data.picture
      }
      
    })
    
    
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit(): void {
    this.data.picture=this.url
    this.profileService.updateUserProfile(this.data)
    this.snackbar.open("Profile updated successfully!","OK",{duration:2000});
  }


}

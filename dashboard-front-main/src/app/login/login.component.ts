import { Router } from '@angular/router';
import { AuthServiceService } from './../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  formGroup : FormGroup = new FormGroup({
    username : new FormControl('', [Validators.required]),
    password :new FormControl('', [Validators.required])
  });
  
  loginProcess(){
    if(this.formGroup.valid){
      this.authService.login(this.formGroup.value).subscribe(
        (result:any)=>{
          this.cookieService.set('token', result.token, 1, '/','localhost', true, "Lax"); 
          this.snackbar.open("Authenticated successfully","OK",{duration:2000});
          this.router.navigateByUrl('/dashboards')      
      }
      ,err=>{
        if (err.status==401){
          this.snackbar.open("Invalid credentials!","OK",{duration:2000})
          this.router.navigateByUrl('/login')
        }
        else{
          this.snackbar.open("Error!","OK",{duration:2000})
        }
      }
      )
    }
  }
  constructor(private authService :AuthServiceService,private cookieService: CookieService,public snackbar: MatSnackBar,private router: Router) { }

  ngOnInit(): void {
    this.cookieService.delete("token");
  }

  

}

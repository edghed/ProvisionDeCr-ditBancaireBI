import { RoleEnum } from '../../users/models/RoleEnum';
import { User } from './../../users/models/User';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from './../../services/user-service.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {
  roleList: string[] = [RoleEnum.admin, RoleEnum.user];
  hide = true;

  constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    public dataService: UserServiceService) { }
    
  formControl = new FormControl('', [
    Validators.required,
  ]);

  toggle = new FormControl('true', [Validators.required])
  toggleGroup = new FormGroup({toggle :this.toggle});
  email = new FormControl('', [
    Validators.email,
    Validators.required
  ]
  );

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    // empty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addItem(this.data);
  }

  ngOnInit(): void {
  }

}

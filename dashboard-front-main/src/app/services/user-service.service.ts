import { User } from './../users/models/User';
import { baseUrl } from './../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private httpClient: HttpClient) { }

  private readonly API_URL = `${baseUrl}/users`;

  dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  get data(): User[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  get users() {
    return this.dataChange.asObservable();
  }

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL+"/all");
      
  }
  
  addItem(user: User): void {
    this.httpClient.post(this.API_URL+"/add", user).subscribe(data => {
      this.dialogData = user;
      //this.toasterService.showToaster('Successfully added', 3000);
      console.log("Successfully Added");
      },
      (err: HttpErrorResponse) => {
      //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      console.error("Error when adding User",err.name);
    });
   }

   updateItem(user: User): void {
    this.httpClient.put(this.API_URL +'/'+ user.id, user).subscribe(data => {
        this.dialogData = user;
        console.log("Successfully edited");

        //this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        console.error("Error when editing User",err.message);
       // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  deleteItem(id: number): void {
    this.httpClient.delete(this.API_URL + '/' + id).subscribe(data => {
      console.log('deleted successfully');
        //this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        console.error('error when deleting user',err.name);

        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }


}

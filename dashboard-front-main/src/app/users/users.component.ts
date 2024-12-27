import { RoleEnum } from './models/RoleEnum';
import { BehaviorSubject} from 'rxjs';
import { UserServiceService } from './../services/user-service.service';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from './models/User';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../dialogs/add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from '../dialogs/edit-user-dialog/edit-user-dialog.component';
import { DeleteUserDialogComponent } from '../dialogs/delete-user-dialog/delete-user-dialog.component';
import { MatTableDataSource } from '@angular/material/table';







@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  data : User[] = [];
  displayedColumns: string[] = ['id', 'username', 'password', 'email','roles', 'active', 'actions'];
  dataSource!: MatTableDataSource<User>;
  index!: number;
  id!: number;
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: UserServiceService
  ) {
    this.loadData()

   }

   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public getRoles(roles :RoleEnum[]):string{
    var result = "";
    if(roles.length==1 && roles[0]!=undefined){
      result= roles[0].valueOf();
    }
    else if (roles[0]!=undefined && roles[1]!=undefined){
      result =roles[0].valueOf() + ", " + roles[1].valueOf;
    }
    return result;
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  ngOnInit(): void {
  }

  public loadData() {

    this.dataService.getAllUsers().subscribe(x=>{
      this.data=x;
    });
    this.dataService = new UserServiceService(this.httpClient);
    this.dataSource = new MatTableDataSource(this.data);
    /*fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });*/
  }

  addNew(): void {

    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data: {user:User }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.dataService.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
    this.loadData();


  }

  editItem(i: number, id: number, username: string, email: string, password: string, active: boolean,roles :string[]) {
    this.id = id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      data: {id: id, username: username, email: email, password:"", active: active, roles:roles}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.dataService.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.dataService.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
    this.loadData();

  }

  deleteItem(i: number, id: number, username: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: {id: id, username: username}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.dataService.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from DataService
        this.dataService.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
    this.loadData();
  }


  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  

}

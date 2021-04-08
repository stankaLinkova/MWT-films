import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-extended-users',
  templateUrl: './extended-users.component.html',
  styleUrls: ['./extended-users.component.css']
})
export class ExtendedUsersComponent implements OnInit, AfterViewInit {

  users: User[] = [];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator:MatPaginator;
  @ViewChild(MatSort) sort:MatSort;
  columnsToDisplay = ["id", "name", "email", "lastLogin", "groups", "permissions", "actions"];

  constructor(private usersServerService: UsersServerService, private dialog: MatDialog) { }
 
  ngOnInit(): void {
   
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (user:User, headerName:string) => {
      switch (headerName){
        case "groups":
          return user.groups[0] ? user.groups[0].name : '';
        default:
          return user[headerName];  
      }
    }
    this.dataSource.filterPredicate = (user:User, filter:string) => {
      if(user.name.toLowerCase().includes(filter)){
        return true;
      }
      for (let group of user.groups) {
        if(group.permissions.some(perm => perm.toLowerCase().includes(filter))){
          return true;
        }
        if(group.name.toLowerCase().includes(filter)){
          return true;
        }
      }
      return false;
    }

    this.usersServerService.getExtendedUsers().subscribe(users =>
      {
        this.dataSource.data = users;
        this.paginator.length = users.length;
      });
  }

  applyFilter(value:string) {
    this.dataSource.filter = value.trim().toLowerCase();
    this.paginator.firstPage();
  }

  deleteUser(user: User){
   const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {
      title: "Deleting user",
      message: "Delete user " + user.name + "?"
    }})
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersServerService.deleteUser(user.id).subscribe(
          ok => {
            if (ok) {
              this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
            }
          }
        )
      }
    })
    
  }

}

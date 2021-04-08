import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users:User[] = [new User("Peter", "peter@peto.sk"), new User( "Jozo", "jojo@jojo.sk", 2, new Date("2021-01-17"))];
  selectedUser: User;
  users$:Observable<User[]>;
  columnsToDisplay=["name", "email", "id"];


  constructor(private usersServerService: UsersServerService) {}

  ngOnInit(): void {
   this.usersServerService.getUsers().subscribe(users => (this.users = users), error => {window.alert("Mame chybu: " + JSON.stringify(error))});
   this.users$ = this.usersServerService.getUsers();
  }

  selectUser(user: User){
    this.selectedUser = user;
  }
}

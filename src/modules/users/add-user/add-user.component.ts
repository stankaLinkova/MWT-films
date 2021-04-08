import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userToEdit = new User('', '');
  constructor(
    private userServerService: UsersServerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  saveUser(user: User) {
    this.userServerService.saveUser(user).subscribe(() => {
      this.router.navigateByUrl('/users/extended');
    });
  }
}

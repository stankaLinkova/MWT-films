import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { CanDeactivateComponent } from 'src/guards/can-deactivate.guard';
import { UsersServerService } from 'src/services/users-server.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, CanDeactivateComponent {
  userToEdit:User;
  userSaved = false;

  constructor(private route: ActivatedRoute, private userServerService: UsersServerService, private router: Router, private dialog: MatDialog) { }
  

  ngOnInit(): void{
    this.route.data.subscribe((data) => {
      console.log(data);
      this.userToEdit = data.user;
      this.userSaved = false;
    }); 
  }

  saveUser(user: User) {
    this.userServerService.saveUser(user).subscribe(() => {
      this.router.navigateByUrl("/users/extended");
      this.userSaved = true;
    })
  }

  canDeactivate():Observable<boolean>|boolean{
       if (this.userSaved) {
         return true;
       }
       const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {
           title: "Leaving?",
           message: "Edited user is not saved, leave?"
       }});
       return dialogRef.afterClosed().pipe(map((result) => !!result));    
  } 
}

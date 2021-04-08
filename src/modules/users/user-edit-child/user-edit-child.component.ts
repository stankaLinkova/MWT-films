import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from 'src/entities/group';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';

@Component({
  selector: 'app-user-edit-child',
  templateUrl: './user-edit-child.component.html',
  styleUrls: ['./user-edit-child.component.css']
})
export class UserEditChildComponent implements OnChanges {

  @Input() user: User;
  @Output() changed = new EventEmitter<User>();
  groups: Group[];

  hide =true;
  
  userEditForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3)], this.serverConflictValidator("name")),
    email: new FormControl("",[
      Validators.required, 
      Validators.email, 
      Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/)], this.serverConflictValidator("email")),
    password: new FormControl(""),
    password2: new FormControl(""),
    active: new FormControl(""),
    groups: new FormArray([])
  }, this.passwordsMatchValidator);

  constructor(private userServerService : UsersServerService, private router: Router) { }
 
  ngOnChanges(): void {
    if (this.user) {
      this.name.setValue(this.user.name);
      this.email.setValue(this.user.email);
      this.active.setValue(this.user.active);
      this.userServerService.getGroups().subscribe(groups => {
        this.groups = groups;
        groups.forEach(group => {
          if (this.user.groups.some(ug => ug.id === group.id)) {
            this.groupsCheckboxes.push(new FormControl(true));
          } else {
            this.groupsCheckboxes.push(new FormControl(false));
          }
        })

      })
    }
  }

  get name() {
    return this.userEditForm.get('name') as FormControl;
  }

  get email() {
    return this.userEditForm.get('email') as FormControl;
  }

  get password(){
    return this.userEditForm.get('password') as FormControl;
  }


  get password2(){
    return this.userEditForm.get('password2') as FormControl;
  }

  get active(){
    return this.userEditForm.get('active') as FormControl;
  }

  get groupsCheckboxes(){
    return this.userEditForm.get('groups') as FormArray;
  }

  passwordsMatchValidator(control: FormGroup): ValidationErrors {
    const password = control.get('password');
    const password2 = control.get('password2');
    if (password.value === password2.value) {
      password2.setErrors(null);
      return null;
    } else {
      password2.setErrors({ differentPasswords: 'Passwords do not match' });
      return { differentPasswords: 'Passwords do not match' };
    }
  }

  serverConflictValidator(conflictFieldName: string): AsyncValidatorFn{
    return (control: FormControl): Observable<ValidationErrors> => {
      const username = conflictFieldName === 'name' ? control.value : '';
      const email = conflictFieldName === 'email' ? control.value : '';
      const user = new User(username, email, this.user.id);
      return this.userServerService.userConflicts(user).pipe(
        map(conflictsArray => {
          return conflictsArray.includes(conflictFieldName) ? {
            conflictField: "This name or email already exists."
          }: null;
        })
      )

    }
  }
  
  formSubmit(){
    const user = new User(
      this.name.value,
      this.email.value,
      this.user.id,
      undefined,
      this.password.value.trim() ? this.password.value.trim() : null,
      this.active.value,
      this.groups.filter((group,i) => this.groupsCheckboxes.at(i).value)
    );
    this.changed.next(user);
  }
}

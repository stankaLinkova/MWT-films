import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';
import * as zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  passwordMessage = '';
  hide =true;
  registerForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3)], this.serverConflictValidator("name")),
    email: new FormControl("",[
      Validators.required, 
      Validators.email, 
      Validators.pattern("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")], this.serverConflictValidator("email")),
    password: new FormControl("", this.passwordValidator()),
    password2: new FormControl("")
  }, this.passwordsMatchValidator);

  constructor(private userServerService : UsersServerService, private router: Router) { }

  ngOnInit(): void {
  }


  get name() {
    return this.registerForm.get('name') as FormControl;
  }

  get email() {
    return this.registerForm.get('email') as FormControl;
  }

  get password(){
    return this.registerForm.get('password') as FormControl;
  }


  get password2(){
    return this.registerForm.get('password2') as FormControl;
  }


  passwordValidator(): ValidatorFn {
    return(control: FormControl) : ValidationErrors =>{
      const result = zxcvbn(control.value);
      const message = "Password strength: " + result.score + " / 4 - must be at least 3 " + 
      result.feedback.warning + "broken password for " + result.crack_times_display.offline_slow_hashing_1e4_per_second;
      this.passwordMessage = message;
      return result.score < 3 ? {weakPassword: message} : null;
    }
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
      const user = new User(username, email);
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
      undefined,
      undefined,
      this.password.value,
    );
    this.userServerService.register(user).subscribe(u => {
      this.router.navigateByUrl("/login");
    });
    
  }

}

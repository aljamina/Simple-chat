import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  registeredUser: User;
  passwordConfirmation: String = '';
  errorMessage: String = '';
  registerForm: FormGroup;
  loginErrorMessage: String = '';
  submitted = false;
  valid = false;
  username: String = '';
  password: String = '';

  constructor(private http: HttpClient, private userService: UserService, private router: Router, private formBuilder: FormBuilder) {
    this.registeredUser = new User('', '', '');
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    else if (this.registeredUser.password != this.passwordConfirmation) {
      this.errorMessage = 'Passwords are not matching!';
      return;
    }
    this.userService.register(this.registeredUser)
      .pipe(first())
      .subscribe(
        data => {
          this.errorMessage = '';
          if (data['token']) {
            localStorage.setItem('token', data['token']);
          this.router.navigate(['/chat']);
        }
        },
        error => {
          this.errorMessage = '';
          if (error.status == 404) this.errorMessage = 'Username already exists';
          else if (error.status == 409) this.errorMessage = 'Email already exists';
          else this.errorMessage = 'Something went wrong. Please try again.';
        });
    this.errorMessage = '';
  }

  login() {

  this.userService.signIn(JSON.stringify({ username: this.username, password: this.password }))
    .pipe(first())
    .subscribe(
      data => {
        this.loginErrorMessage = '';
        if (data['token']) {
          localStorage.setItem('token', data['token']);
          this.router.navigate(['/chat']);
        }
      },
      error => {
        this.loginErrorMessage = '';
        if (error.status == 404) this.loginErrorMessage = 'Wrong username or password';
        else this.loginErrorMessage = 'Something went wrong. Please try again.';
      });
  this.loginErrorMessage = '';
}

}

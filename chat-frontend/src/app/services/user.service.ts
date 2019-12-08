import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseurl = 'http://localhost:5000';

  constructor(private http: HttpClient, private router: Router) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  public signIn(data) {
    return this.http.post(this.baseurl + '/token/sign', data, this.httpOptions)
      .pipe(map(data =>
        data));
  }

  public register(data) {
    return this.http.post(this.baseurl + '/register', data, this.httpOptions)
      .pipe(map(data =>
        data));
  }

  public addContact(data) {
    return this.http.post(this.baseurl + '/newContact', data, this.httpOptions)
      .pipe(map(data =>
        data));
  }
  public getContacts() {
    return this.http.get(this.baseurl + '/contacts', this.httpOptions)
      .pipe(map(data =>
        data));
  }

}

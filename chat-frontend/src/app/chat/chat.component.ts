import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { UserService } from '../services/user.service';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

@Injectable()
export class ChatComponent implements OnInit {

  private socket;
  username: String = '';
  errorMessage: String = '';
  contactList: any = [];
  currentuserID: any;
  ioConnection: any;
  receivedMessages: any = [];
  sentMessages: any = [];
  empty = true;
  newMessage: String = '';

  constructor(private http: HttpClient, private userService: UserService) {
    this.socket = io.connect('http://localhost:5000/');
  }

  ngOnInit() {
    this.socket.on('inital_messages', (data: any) => {
      this.receivedMessages = data;
    });

    this.userService.getContacts()
      .subscribe((data: any) => {
        this.contactList = data.contacts;
        this.currentuserID = data.currentuser;
      })
    this.socket.on('new_message', (data: any) => {
      this.receivedMessages.unshift(data);
    });
  }

  addNewContact() {
    this.userService.addContact(JSON.stringify({ username: this.username }))
      .pipe(first())
      .subscribe(
        data => {
          this.contactList.unshift({ contactId: data, contactUserName: this.username });
        },
        error => {
          if (error.status == 404) this.errorMessage = 'Not existing user';
          else if (error.status == 409) this.errorMessage = 'Already in contacts';
          else this.errorMessage = 'Something went wrong, try again';
        });
    this.errorMessage = '';
  }

  openChat(id) {
    this.receivedMessages = [];
    this.socket.emit("subscribe", { id1: id, id2: this.currentuserID });
    this.empty = false;
  }

  new_message() {
    this.newMessage = "Evo je nova poruka";
    this.sentMessages.push(this.newMessage);
    var content = (<HTMLInputElement>document.getElementById("content")).value;
    this.socket.emit("new_message", { content: content, currentUser: this.currentuserID });
    var inputElement=<HTMLInputElement>document.getElementById("content");
    inputElement.value = '';
  }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
token: any;
currentTab: any;
isChat=false;

constructor( private router: Router) {
  }

  ngOnInit() {
    this.currentTab=window.location.href;
    if(this.currentTab=="http://localhost:4200/chat") this.isChat=true;
  this.token=localStorage.getItem('token');
  }

  logout(){
     localStorage.setItem('token', JSON.stringify({}));
     this.router.navigate(['/login']);
  }
}

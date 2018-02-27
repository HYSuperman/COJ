import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = "COJ";

  username = "Joe";

  constructor(@Inject('auth') private auth) { }

  ngOnInit() {
    if (this.auth.authenticated()) {
      this.username = this.auth.getProfile().nickname;
    }
  }

  login(): void {
    this.auth.login()
      .then( Profile => { this.username = Profile.nickname; });
  }

  logout(): void {
    this.auth.logout();
  }

}

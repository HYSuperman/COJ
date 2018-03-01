// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';
import { Http, Response, Headers } from '@angular/http';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  clientId = '7RlUVqhGaPAwVzw4Oye6TkG9YH7m2HXb';
  domain = 'cs503hy.auth0.com';
  lock = new Auth0Lock(this.clientId, this.domain, {});

  constructor(private http: Http) {
    // lock v11
    // const self = this;
    // this.lock.on('authenticated', function (authResult) {
    //   self.lock.getUserInfo(authResult.accessToken, function (error, profile) {
    //     if (error) {
    //       // Handle error
    //       return;
    //     }
    //
    //     // Save token and profile locally
    //     // localStorage.setItem('accessToken', authResult.accessToken);
    //     localStorage.setItem('id_token', authResult.idToken);
    //     localStorage.setItem('expiresIn', authResult.expiresIn);
    //     localStorage.setItem('profile', JSON.stringify(profile));
    //
    //     // Update DOM
    //   });
    //   console.log(tokenNotExpired('id_token'));
    // });

  }

  public login(): Promise<Object> {
    return new Promise((resolve, reject) => {

      // Call the show method to display the widget.
      this.lock.show((error: string, profile: Object, id_token: string) => {
        if (error) {
          reject(error);
        } else {

          localStorage.setItem('profile', JSON.stringify(profile));
          localStorage.setItem('id_token', id_token);
          resolve(profile);
        }
      });
    });
  }

  public authenticated() {
    return tokenNotExpired('id_token');
  }

  public logout() {
    // localStorage.removeItem('accessToken');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expiresIn');

    this.lock.logout({
      returnTo: 'http://localhost:3000/'
    });
  }

  public getProfile() {
    return JSON.parse(localStorage.getItem('profile'));
  }

  public resetPassword(): void {
    let profile = this.getProfile();
    let url: string = `https://${this.domain}/dbconnections/change_password`;
    let headers = new Headers({ 'content-type': 'application/json' });
    let body = {
      client_id: this.clientId,
      email: profile.email,
      connection: 'Username-Password-Authentication'
    }

    this.http.post(url, body, headers)
      .toPromise()
      .then((res: Response) => {
        console.log(res.json());
      })
      .catch(this.handleError);

  }
  private handleError(error: any): Promise<any> {
    console.error('Error occurred', error);
    return Promise.reject(error.message || error);
  }

}

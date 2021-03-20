import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import * as moment from 'moment';
import { auth } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor(private http: HttpClient, private router: Router) {}

  auth: boolean;

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  login(reqObject: object) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http
      .post(`${environment.API}/users/login`, reqObject, { headers: headers })
      .subscribe(
        // The response data
        (response) => {
          this.loggedIn.next(true);
          // If the user authenticates successfully, we need to store the JWT returned in localStorage
          this.setLocalStorage(response);
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log("login complete");
          this.router.navigate(['dashboard']);
        }
      );
  }

  setLocalStorage(responseObject) {
    const expiresAt = moment().add(responseObject.expiresIn);

    localStorage.setItem('id_token', responseObject.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  isLoggedIn() {
    return this.isAuthenticated().pipe(
      tap((res: auth) => {
        // console.log('isLogged in RES: ', res);
        this.loggedIn.next(res.success);
      }),
      catchError((error) => {
        this.loggedIn.next(false);
        return of(false);
      })
    );
  }

  isAuthenticated(): Observable<auth> {
    return this.http.get<auth>(`${environment.API}/users/protected`);
  }

  registerAccount() {}

  deleteAccount() {}
}

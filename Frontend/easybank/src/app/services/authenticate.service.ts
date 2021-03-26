import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import * as moment from 'moment';
import { auth } from '../models/auth.model';
import { user} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor(private http: HttpClient, private router: Router) {}

  auth: boolean;
  user: user;

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  adminLog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Login User
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

          console.log('login done');
          this.router.navigate(['dashboard']);

        }
      );
  }

  // Set JWT Token in local storage
  setLocalStorage(responseObject) {
    const expiresAt = moment().add(responseObject.expiresIn);

    localStorage.setItem('id_token', responseObject.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  // Remove JWT Token from local storage on logout
  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  // Check if user is logged in
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

  isAdminLoggedIn() {
    return this.isAdmin().pipe(
      tap((res: auth) => {
        // console.log('isLogged in RES: ', res);
        this.adminLog.next(res.success);
      }),
      catchError((error) => {
        this.adminLog.next(false);
        return of(false);
      })
    );
  }

  // 
  isAuthenticated(): Observable<auth> {
    return this.http.get<auth>(`${environment.API}/users/protected`);
  }

  //
  isAdmin(): Observable<auth>{

    return this.http.get<auth>(`${environment.API}/users/admin`);

  }

  // Register User Account
  registerAccount(reqObject: Object) {

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http
    .post(`${environment.API}/users/register`, reqObject, { headers: headers })
    .subscribe(
      // The response data
      (response) => {
        this.login(reqObject);
        console.log(response);
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log("Register complete");
        this.router.navigate(['dashboard']);
      }
    );
  }

  // Get authenticatd users details
  GetUserDetails(){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.get(`${environment.API}/users/profile`, {headers: headers});

  }

  UpdateUserDetails(reqObject: object){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.post(`${environment.API}/users/updatedetails`, reqObject, {headers: headers});

  }

  UpdateSecurityDetails(reqObject: object){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.post(`${environment.API}/users/updatesecurity`, reqObject, {headers: headers});

  }

  // Delete accout from system and redirect to /home
  deleteAccount() {}
}

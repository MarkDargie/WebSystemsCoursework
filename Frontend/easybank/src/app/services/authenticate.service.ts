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

  /**
   * Login User Request
   * @param reqObject User Credential from form data
   * @returns http POST: Authentication Response
   */
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
          this.router.navigate(['dashboard']);
        }
      );
  }

  /**
   * Set JWT Token in local storage
   */
  setLocalStorage(responseObject) {
    const expiresAt = moment().add(responseObject.expiresIn);

    localStorage.setItem('id_token', responseObject.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  /**
   * Logout: Remove Local Storage Variables
   */
  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('theme');
  }

  /**
   * Verify if user is logged in Via IsAuthenticated()
   * @returns Boolean of type Auth
   */
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

  /**
   * Verify if Admin access user is authenticated
   * @returns Boolean of type Auth
   */
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

  /**
   * Authenticated Request
   * @returns http POST: Authentication Response of type Auth
   */
  isAuthenticated(): Observable<auth> {
    return this.http.get<auth>(`${environment.API}/users/protected`);
  }

  /**
   * Admin Authenticated Request
   * @returns http POST: Authenticated Response of type Auth
   */
  isAdmin(): Observable<auth>{
    return this.http.get<auth>(`${environment.API}/users/admin`);
  }

  /**
   * Register user Account
   * @param reqObject form data fields from register component
   * @returns http POST: Register Response
   */
  registerAccount(reqObject: Object) {

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http
    .post(`${environment.API}/users/register`, reqObject, { headers: headers })
    .subscribe(
      // The response data
      (response) => {
        this.login(reqObject);
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.router.navigate(['login']);
      }
    );
  }

  /**
   *  Get user Details
   * @returns http GET: User Details response
   */
  GetUserDetails(){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.get(`${environment.API}/users/profile`, {headers: headers});

  }

  /**
   * Update User Account Details Request
   */
  UpdateUserDetails(reqObject: object){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.post(`${environment.API}/users/updatedetails`, reqObject, {headers: headers});

  }

  /**
   * Update User Security Details Request
   */
  UpdateSecurityDetails(reqObject: object){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.post(`${environment.API}/users/updatesecurity`, reqObject, {headers: headers});

  }

  /**
   * Remove User Account Request
   */
  deleteAccount() {

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.post(`${environment.API}/users/remove`, {headers: headers});

  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(
    private http: HttpClient,
    private router : Router
  ) { }

  auth: boolean;

  login(){

  }

  setLocalStorage(){

  }

  logout(){

  }

  isLoggedIn(){

  }

  isAuthenticated(){

  }

  registerAccount(){
    
  }

  deleteAccount(){

  }

}

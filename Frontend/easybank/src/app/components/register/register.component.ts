import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AuthenticateService} from '../../services/authenticate.service';
import { EmailValidator } from '@angular/forms';
import {NgForm, FormControl, Validators} from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private authenticateService: AuthenticateService,
    private http: HttpClient,
    private router: Router,
  ) { }

  auth: boolean;

  @ViewChild('registerform', { static: false }) registerform: NgForm;

  ngOnInit(): void {

    this.authenticateService.isLoggedIn().pipe(
      tap(()=>{
        this.auth = this.authenticateService.loggedIn.value;
        if(this.auth == true){
          this.router.navigate(['/dashboard']);
        }
      })
    ).subscribe();

  }

  OnRegisterFormSubmit()
  {
    // define consts
    const username = this.registerform.value.fname;
    const email = this.registerform.value.email;
    const password = this.registerform.value.password;
    const securecode = this.registerform.value.securecode;

    // create req object
    const reqObject = {
      username: username,
      email: email,
      password: password,
      securecode: securecode
    }

    // call register from auth service
    this.authenticateService.registerAccount(reqObject);

  }

}

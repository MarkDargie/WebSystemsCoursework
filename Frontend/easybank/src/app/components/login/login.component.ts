import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AuthenticateService} from '../../services/authenticate.service';
import { EmailValidator } from '@angular/forms';
import {NgForm, FormControl, Validators} from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  formfield = new FormControl('', [Validators.required, Validators.required]);

  constructor(
    private authenticateService: AuthenticateService,
    private http: HttpClient,
    private router: Router,
  ) { }

  auth: boolean;
  hide = true;

  @ViewChild('loginform', { static: false }) loginform: NgForm;

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    if(this.formfield.hasError('required')){
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessage() {
    if(this.formfield.hasError('required')){
      return 'You must enter a value';
    }

  }

  ngOnInit(): void {

    this.authenticateService.isLoggedIn().pipe(
      tap(()=>{
        this.auth = this.authenticateService.loggedIn.value;
        if(this.auth == true){
          this.router.navigate([`dashboard`]);
        }
      })
    ).subscribe();

  }

  onLoginButtonClick()
  {

    const username = this.loginform.value.username;
    const password = this.loginform.value.password;

    const reqObject = {
      username: username,
      password: password
    }

    this.authenticateService.login(reqObject);

  }

}

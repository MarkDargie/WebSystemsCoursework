import { Component, OnInit } from '@angular/core';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AuthenticateService} from '../../services/authenticate.service';
import { EmailValidator } from '@angular/forms';
import {NgForm, FormControl, Validators} from '@angular/forms';
import { ViewChild } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * Set Form Control Validators
   */
  email = new FormControl('', [Validators.required, Validators.email]);
  formfield = new FormControl('', [Validators.required, Validators.required]);

  constructor(
    private authenticateService: AuthenticateService,
    private http: HttpClient,
    private router: Router,
    private snackbar: SnackbarService
  ) { }

  auth: boolean;
  hide = true;

  // View Login Form
  @ViewChild('loginform', { static: false }) loginform: NgForm;

  /**
   * Get Email Error Message for Validation
   * @returns Error Message
   */
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    if(this.formfield.hasError('required')){
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  /**
   * Get Error Message for Validation
   * @returns Error Message
   */
  getErrorMessage() {
    if(this.formfield.hasError('required')){
      return 'You must enter a value';
    }

  }

  // Called when component is initialsed
  ngOnInit(): void {

    /**
     * Verify if user is authenticated
     */
    this.authenticateService.isLoggedIn().pipe(
      tap(()=>{
        this.auth = this.authenticateService.loggedIn.value;
        if(this.auth == true){
          this.router.navigate([`dashboard`]);
        }
      })
    ).subscribe();

  }

  /**
   * Method for login form submission
   */
  onLoginButtonClick()
  {

    // Set form field values
    const username = this.loginform.value.username;
    const password = this.loginform.value.password;

    if(!username || !password){
      alert("no usename or password");
    } else {

      // create request object
      const reqObject = {
        username: username,
        password: password
      }
  
      // Request login via: Authenticate Service
      this.authenticateService.login(reqObject);
    }
  }

}

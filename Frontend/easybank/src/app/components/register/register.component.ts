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

  /**
   * Set Form Control Validators
   */
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.min(6)]);
  formfield = new FormControl('', [Validators.required, Validators.required]);

  constructor(
    private authenticateService: AuthenticateService,
    private http: HttpClient,
    private router: Router,
  ) { }

  auth: boolean;
  hide = true;

  @ViewChild('registerform', { static: false }) registerform: NgForm;

  /**
   * Get Email Error Message for Validation
   * @returns Error Message
   */
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
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

  /**
   * Get Error Message for Validation
   * @returns Error Message
   */
  getPassErrorMessage(){
    if(this.password.hasError('required')){
      return 'You must enter a valid password. Password must be at least 6 Characters';
    }
  }

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

  /**
   * Handle Register Reqeust Form Data Submission
   */
  OnRegisterFormSubmit()
  {
    // define consts from form data
    const username = this.registerform.value.username;
    const email = this.registerform.value.email;
    const password = this.registerform.value.password;
    const passwordconf = this.registerform.value.passwordconf;
    const securecode = this.registerform.value.securecode;
    
    if(!username || !email || !password || !passwordconf || !securecode){

      alert("Please Fill in all required fields");

    } else if (password != passwordconf){
      alert("Password do not match");
    }
    
    else {

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

}

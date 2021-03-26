import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, NgForm, Validators} from '@angular/forms';
import {AuthenticateService} from '../../services/authenticate.service';
import {TestingService} from '../../services/testing.service';
import {user} from '../../models/user.model';
import {ThemeService} from '../../theme/theme.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  formfield = new FormControl('', [Validators.required, Validators.required]);
  password = new FormControl('', [Validators.required, Validators.min(6)]);

  @ViewChild('settingsform', { static: false }) settingsform: NgForm;
  @ViewChild('themeform', { static: false }) themeform: NgForm;
  @ViewChild('securityform', { static: false }) securityform: NgForm;

  constructor(
    private authenticateService: AuthenticateService,
    private testingService: TestingService,
    private themeService: ThemeService,
    private snackbar: SnackbarService
  ) { }

  hide = true;
  selectedValue: string;

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

  getPassErrorMessage(){
    if(this.password.hasError('required')){
      return 'You must enter a valid password. Password must be at least 6 Characters';
    }
  }

  ngOnInit(): void {
  }

  // settings form submit
  onSettingsFormSubmit(){

    const username = this.settingsform.value.username;
    const email = this.settingsform.value.email;

    if(!username || !email){
      alert("Please Fill in all required fields");
    } else {

      const reqObject = {
        username: username,
        email: email
      }
  
      console.log(reqObject);
  
      this.authenticateService.UpdateUserDetails(reqObject).pipe(
        tap((res)=>{
          this.snackbar.open({
            message:"Details Updated Successfully",
            error:false
          });
          // this.settingsform.reset();
        }),
        catchError((error)=>{
          this.snackbar.open({
            message: error.message,
            error:true
          });
          return of(false);
        })
      ).subscribe();

      

    }



  }

  onThemeFormSubmit(){

    const theme = this.themeform.value.theme;

    if(theme == "light"){
      this.themeService.setLightTheme();
    }
    
    if(theme == "dark"){
      this.themeService.setDarkTheme();
    }

  }

  onSecurityFormSubmit(){

    const oldpassword = this.securityform.value.oldpassword;
    const newpassword = this.securityform.value.newpassword;

    if(!oldpassword || !newpassword){
      alert("Please Fill in all required fields");
    } else {

      const reqObject = {
        oldpassword: oldpassword,
        newpassword: newpassword
      }
  
      this.authenticateService.UpdateSecurityDetails(reqObject).pipe(
        tap((res)=>{
          this.snackbar.open({
            message:"Details Updated Successfully",
            error:false
          });
          // this.securityform.reset();
        }),
        catchError((error)=>{
          this.snackbar.open({
            message: error.message,
            error:true
          });
          return of(false);
        })
      ).subscribe();


    }


  }

}

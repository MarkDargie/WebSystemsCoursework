import { Component, OnInit, ElementRef } from '@angular/core';
import {NgForm, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import {TransactionService} from '../../services/transaction.service';
import {TestingService} from '../../services/testing.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  /**
   * Set Form control validators
   */
  formfield = new FormControl('', [Validators.required, Validators.required]);

  constructor(
    private transactionService: TransactionService,
    private testingService: TestingService,
    private snackbar: SnackbarService
  ) { }

  hide = true;

  /**
   * View form Fields
   */
  @ViewChild('secureform', { static: false }) secureform: NgForm;
  @ViewChild('expressform', { static: false }) expressform: NgForm;

  ngOnInit(): void {
  }

  /**
   * Get Error Message for Validation
   * @returns Error Message
   */
  getErrorMessage() {
    if (this.formfield.hasError('required')) {
      return 'You must enter a value';
    }

  }

 /**
  * Secure Payment Method Request
  */
  OnSecurePaymentSubmit(){

    // handle form fields
    const sendto = this.secureform.value.username;
    const fromcode = this.secureform.value.fromcode;
    const tocode = this.secureform.value.tocode;
    const payment = this.secureform.value.amount;

    // Validate form data
    if(!sendto || !fromcode || !tocode || !payment){
      alert("Please Fill in al Required Fields");
    } else {

      // create request object
      const paymentObject = {
        sendto: sendto,
        fromcode: fromcode,
        tocode: tocode,
        payment: payment
      }
  
      /**
       * Send Payment request to transaction service
       */
      this.transactionService.securePayment(paymentObject).pipe(
        tap((res)=>{
          this.snackbar.open({
            message:"Secure Payment Successfull",
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
  
      // Create testing request
      this.testingService.PostSecurePayment().subscribe();

      this.secureform.reset();

    }


  }

  // Method for express payments
  OnExpressPaymentSubmit(){

    // Handle form data
    const sendto = this.expressform.value.username;
    const payment = this.expressform.value.amount;

    if(!sendto || !payment){
      alert("Please Fill in al Required Fields");
    } else {

      // Create request object
      const paymentObject = {
        sendto: sendto,
        payment: payment
      }
  
      /**
       * Send Payment request to transaction service
       */
      this.transactionService.expressPayment(paymentObject).pipe(
        tap((res)=>{
          this.snackbar.open({
            message:"Express Payment Successfull",
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
  
      // Create testing request
      this.testingService.PostExpressPayment().subscribe();

      this.expressform.reset();

    }



  }

}

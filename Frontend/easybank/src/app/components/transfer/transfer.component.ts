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

  formfield = new FormControl('', [Validators.required, Validators.required]);

  constructor(
    private transactionService: TransactionService,
    private testingService: TestingService,
    private snackbar: SnackbarService
  ) { }

  hide = true;

  @ViewChild('secureform', { static: false }) secureform: NgForm;
  @ViewChild('expressform', { static: false }) expressform: NgForm;

  ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.formfield.hasError('required')) {
      return 'You must enter a value';
    }

  }

  // Method for secure payments
  OnSecurePaymentSubmit(){

    const sendto = this.secureform.value.username;
    const fromcode = this.secureform.value.fromcode;
    const tocode = this.secureform.value.tocode;
    const payment = this.secureform.value.amount;

    if(!sendto || !fromcode || !tocode || !payment){
      alert("Please Fill in al Required Fields");
    } else {

      const paymentObject = {
        sendto: sendto,
        fromcode: fromcode,
        tocode: tocode,
        payment: payment
      }
  
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
  
      this.testingService.PostSecurePayment().subscribe();

      this.secureform.reset();

    }


  }

  // Method for express payments
  OnExpressPaymentSubmit(){

    const sendto = this.expressform.value.username;
    const payment = this.expressform.value.amount;

    if(!sendto || !payment){
      alert("Please Fill in al Required Fields");
    } else {

      const paymentObject = {
        sendto: sendto,
        payment: payment
      }
  
      this.transactionService.expressPayment(paymentObject).subscribe();
  
      this.testingService.PostExpressPayment().subscribe();

      this.expressform.reset();

    }



  }

}

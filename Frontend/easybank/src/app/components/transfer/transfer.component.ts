import { Component, OnInit, ElementRef } from '@angular/core';
import {NgForm, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import {TransactionService} from '../../services/transaction.service';
import {TestingService} from '../../services/testing.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  constructor(
    private transactionService: TransactionService,
    private testingService: TestingService
  ) { }

  hide = true;

  @ViewChild('secureform', { static: false }) secureform: NgForm;
  @ViewChild('expressform', { static: false }) expressform: NgForm;

  ngOnInit(): void {
  }

  // Method for secure payments
  OnSecurePaymentSubmit(){

    const sendto = this.secureform.value.username;
    const fromcode = this.secureform.value.fromcode;
    const tocode = this.secureform.value.tocode;
    const payment = this.secureform.value.amount;

    const paymentObject = {
      sendto: sendto,
      fromcode: fromcode,
      tocode: tocode,
      payment: payment
    }

    this.transactionService.securePayment(paymentObject).subscribe();

    this.testingService.PostSecurePayment().subscribe();
  }

  // Method for express payments
  OnExpressPaymentSubmit(){

    const sendto = this.expressform.value.username;
    const payment = this.expressform.value.amount;

    const paymentObject = {
      sendto: sendto,
      payment: payment
    }

    this.transactionService.expressPayment(paymentObject).subscribe();

    this.testingService.PostExpressPayment().subscribe();

  }

}

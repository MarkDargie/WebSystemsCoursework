import { Component, OnInit } from '@angular/core';
import {AuthenticateService} from '../../services/authenticate.service';
import {TransactionService} from '../../services/transaction.service';
import {TestingService} from '../../services/testing.service';
import {NgForm, FormControl, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders, JsonpClientBackend } from '@angular/common/http';
import {user} from '../../models/user.model';
import {transaction} from '../../models/transaction.model';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  formfield = new FormControl('', [Validators.required, Validators.required]);

  @ViewChild('requestform', {static: false}) requestform: NgForm;

  constructor(
    private transactionService: TransactionService,
    private testingService: TestingService,
    private authenticateService: AuthenticateService,
    private snackbar: SnackbarService
  ) { }

  user: user;

  // Set Data Storage Object
  allTransactions: transaction[];
  sentTransactions: transaction[];
  receivedTransactions: transaction[];
  pendingTransactions: transaction[];

  selectedValue: string;

  /**
   * Get Error Message for Validation
   * @returns Error Message
   */
  getErrorMessage() {
    if (this.formfield.hasError('required')) {
      return 'You must Select a Method';
    }

  }

  ngOnInit(): void {

    /**
     * Get Authenticated User: Authenticate Service
     */
    this.authenticateService.GetUserDetails().subscribe((user: user)=> {
      this.user = user;
    });

    /**
     *  Get User Payments: Transaction Service
     */
    this.transactionService.getAllPayments().subscribe((payments: transaction[])=>{
      this.allTransactions = payments;
    })

    /**
     *  Get Sent User Payments: Transaction Service
     */
    this.transactionService.getSentPayments().subscribe((sentPayments: transaction[])=>{
      this.sentTransactions = sentPayments;
    });

     /**
     *  Get Received User Payments: Transaction Service
     */
    this.transactionService.getReceivedPayments().subscribe((receivedPayments: transaction[])=>{
      this.receivedTransactions = receivedPayments;
    });

    /**
     *  Get Pending User Payments: Transaction Service
     */
    this.transactionService.GetPendingPayments().subscribe((pendingPayments: transaction[])=>{
      this.pendingTransactions = pendingPayments;
    });

  }

  /**
   * Transaction Statement Request Method
   */
  OnRequestSubmit(){
    const type = this.requestform.value.requesttype;
    if(type){
      this.generatePDF(type);
    }

  }

  /**
   * Confirm Pending Payment Method
   * @param id payment id
   * @param from from user id
   */
  OnPaymentConfirm(id: string, from: string){

    // Create Req object
    const reqObject = {
      id: id,
      from: from
    }

    this.transactionService.confirmPending(reqObject).pipe(
      tap((res)=>{
        this.snackbar.open({
          message:"Payment Confirm Successfull",
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

  /**
   * Reject Pending Payment Method
   * @param id from user id
   */
  OnPaymentReject(id: string){

    const reqObject = {
      id: id
    }

    this.transactionService.rejectPending(reqObject).pipe(
      tap((res)=>{
        this.snackbar.open({
          message:"Payment Reject Successfull",
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

  /**
   * Generate Transaction Statement PDF File from User Transactions
   * @param method Request Method
   */
  generatePDF(method: string){

    var pdf = new jsPDF(); // Create jsPDF Variable

    // Set Options
    pdf.setFontSize(15);
    pdf.text(`EasyBank Transaction Statement`, 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    var header = ["Method", 'Amount','To','From','Status'];
    var rows= [];

    // Append User Transaction Data
    for(var value in this.allTransactions){
      var row = [
        this.allTransactions[value].method,
        this.allTransactions[value].amount,
        this.allTransactions[value].to,
        this.allTransactions[value].from,
        this.allTransactions[value].status];
      rows.push(row);
    }
    
    // Create Table from data
    (pdf as any).autoTable({
    head: [header],
    body: rows,
    theme: 'striped',
    didDrawCell: data => {
        console.log(data.column.index)
    }
    });

    /**
     * IF direct method: Direct Downdload of PDF statement
     */
    if(method == "direct"){

      // Open PDF document in browser's new tab
      pdf.output('dataurlnewwindow');
      // Send testing request
      this.testingService.PostAppStatement().subscribe();

    }

    /**
     * IF External method: Request to Email service
     */
    if(method == "email"){

      var blob = pdf.output('blob');

      let payload = new FormData();
      payload.append('pdf', blob);
      payload.append('id', this.user._id);

      console.log("USER ID EMAIL: ", this.user._id);

      this.transactionService.EmailRequest(payload).subscribe();
      this.testingService.PostExternalStatement().subscribe();

    }



  }


}

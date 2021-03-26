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
    private authenticateService: AuthenticateService
  ) { }

  user: user;

  allTransactions: transaction[];
  sentTransactions: transaction[];
  receivedTransactions: transaction[];
  pendingTransactions: transaction[];

  selectedValue: string;

  getErrorMessage() {
    if (this.formfield.hasError('required')) {
      return 'You must Select a Method';
    }

  }

  ngOnInit(): void {

    this.authenticateService.GetUserDetails().subscribe((user: user)=> {
      this.user = user;
    });

    this.transactionService.getAllPayments().subscribe((payments: transaction[])=>{
      this.allTransactions = payments;
    })

    this.transactionService.getSentPayments().subscribe((sentPayments: transaction[])=>{
      this.sentTransactions = sentPayments;
      console.log("sent: ", sentPayments);
    });

    this.transactionService.getReceivedPayments().subscribe((receivedPayments: transaction[])=>{
      this.receivedTransactions = receivedPayments;
      console.log("RECIVED: ", receivedPayments);
    });

    this.transactionService.GetPendingPayments().subscribe((pendingPayments: transaction[])=>{
      this.pendingTransactions = pendingPayments;
      console.log("PENDING: ", pendingPayments);
    });

  }

  OnRequestSubmit(){

    const type = this.requestform.value.requesttype;
    console.log("REQUES TYPE: ", type);


    if(type){
      this.generatePDF(type);
    }


  }

  OnPaymentConfirm(id: string, from: string){

    const reqObject = {
      id: id,
      from: from
    }

    this.transactionService.confirmPending(reqObject).subscribe();

  }

  OnPaymentReject(id: string){

    const reqObject = {
      id: id
    }

    this.transactionService.rejectPending(reqObject).subscribe();

  }

  generatePDF(method: string){

    var pdf = new jsPDF();

    pdf.setFontSize(15);
    pdf.text(`EasyBank Transaction Statement`, 11, 8);
    // pdf.text(`${this.user.username} ${this.user.email}`, 12, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    var header = ["Method", 'Amount','To','From','Status'];
    var rows= [];

    for(var value in this.allTransactions){
      var row = [
        this.allTransactions[value].method,
        this.allTransactions[value].amount,
        this.allTransactions[value].to,
        this.allTransactions[value].from,
        this.allTransactions[value].status];
      rows.push(row);
    }
    

    (pdf as any).autoTable({
    head: [header],
    body: rows,
    theme: 'striped',
    didDrawCell: data => {
        console.log(data.column.index)
    }
    });

    if(method == "direct"){

      // Open PDF document in browser's new tab
      pdf.output('dataurlnewwindow');

      // Download PDF doc  
      pdf.save('table.pdf');

      this.testingService.PostAppStatement().subscribe();

    }

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

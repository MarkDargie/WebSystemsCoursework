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

  @ViewChild('requestform', {static: false}) requestform: NgForm;

  constructor(
    private transactionService: TransactionService,
    private testingService: TestingService
  ) { }

  allTransactions: transaction[];
  sentTransactions: transaction[];
  receivedTransactions: transaction[];
  pendingTransactions: transaction[];

  selectedValue: string;

  ngOnInit(): void {

    this.transactionService.getAllPayments().subscribe((payments: transaction[])=>{
      this.allTransactions = payments;
    })

    this.transactionService.getSentPayments().subscribe((sentPayments: transaction[])=>{
      this.sentTransactions = sentPayments;
    });

    this.transactionService.getReceivedPayments().subscribe((receivedPayments: transaction[])=>{
      this.receivedTransactions = receivedPayments;
    });

    this.transactionService.GetPendingPayments().subscribe((pendingPayments: transaction[])=>{
      this.pendingTransactions = pendingPayments;
    });

  }

  OnRequestSubmit(){

    const type = this.requestform.value.requesttype;
    console.log("REQUES TYPE: ", type);

    if(type == "direct"){

      this.generatePDF();

    }

    if(type == "email"){

    }

  }

  generatePDF(){

    var pdf = new jsPDF();

    pdf.setFontSize(15);
    pdf.text(`EasyBank Transaction Statement`, 11, 8);
    // pdf.text(`${this.user.username} ${this.user.email}`, 12, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    // const header = [
    //   {title: 'Method', dataKey: 'method'},
    //   {title: 'Amount', dataKey: 'amount'},
    //   {title: 'From', dataKey: 'from'},
    //   {title: 'From', dataKey: 'from'},
    //   {title: 'From', dataKey: 'from'},
    //   {title: 'From', dataKey: 'from'},
    //   {title: 'From', dataKey: 'from'},
    //   {title: 'From', dataKey: 'from'},
    // ]

    // const rows = [];
    // for(let key in this.transactions){
    //   rows.push({key: this.transactions[key]}).toString();
    // }


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

    // Open PDF document in browser's new tab
    pdf.output('dataurlnewwindow');

    // Download PDF doc  
    pdf.save('table.pdf');

  }

}

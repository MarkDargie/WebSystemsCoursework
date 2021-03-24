import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {AuthenticateService} from '../../services/authenticate.service';
import {TransactionService} from '../../services/transaction.service';
import { HttpClient, HttpHeaders, JsonpClientBackend } from '@angular/common/http';
import {user} from '../../models/user.model';
import {transaction} from '../../models/transaction.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas'
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { image } from 'html2canvas/dist/types/css/types/image';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('paymenttable', {static: false}) paymenttable: ElementRef;

  constructor(
    private authenticateService: AuthenticateService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  user: user;
  transactions: transaction[];

  ngOnInit(): void {

    this.authenticateService.GetUserDetails().subscribe((user: user)=>{
      this.user = user;
      console.log(user);
    });

    this.transactionService.getAllPayments().subscribe((transaction: transaction[])=>{
      this.transactions = transaction;
      console.log(transaction);
    })

  }

  // move this to a service 
  // generatePdf(){
  //   var element = document.getElementById('payments');

  //   html2canvas(element).then((canvas) =>{
  //     console.log(canvas);

  //     var imageData = canvas.toDataURL('image/png');

  //     var imageHeight = canvas.height * 208 / canvas.width;

  //     var doc = new jsPDF();

  //     doc.addImage(imageData, 0, 0, 208, imageHeight);
  //     doc.save("statement.pdf");

  //   });
  // }


  // header = [['ID', 'Name', 'Email', 'Profile', 'test', 'test']]

  // tableData = [
  //   [1, 'John', 'john@yahoo.com', 'HR'],
  //   [2, 'Angel', 'angel@yahoo.com', 'Marketing'],
  //   [3, 'Harry', 'harry@yahoo.com', 'Finance'],
  //   [4, 'Anne', 'anne@yahoo.com', 'Sales'],
  //   [5, 'Hardy', 'hardy@yahoo.com', 'IT'],
  //   [6, 'Nikole', 'nikole@yahoo.com', 'Admin'],
  //   [7, 'Sandra', 'Sandra@yahoo.com', 'Sales'],
  //   [8, 'Lil', 'lil@yahoo.com', 'Sales']
  // ]


  generatePdf() {
    var pdf = new jsPDF();

    pdf.setFontSize(15);
    pdf.text(`EasyBank Transaction Statement \n 
    ${this.user.username} ${this.user.email}`, 11, 8);
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

    for(var value in this.transactions){
      var row = [
        this.transactions[value].method,
        this.transactions[value].amount,
        this.transactions[value].to,
        this.transactions[value].from,
        this.transactions[value].status];
      rows.push(row);
    }
    

    (pdf as any).autoTable({
    head: [header],
    body: rows,
    theme: 'striped',
    didDrawCell: data => {
        console.log(data.column.index)
    }
    })

    // Open PDF document in browser's new tab
    pdf.output('dataurlnewwindow')

    // Download PDF doc  
    pdf.save('table.pdf');
} 


  // public downloadAsPDF(){

  //   const doc = new jsPDF();

  //   const specialElementHandlers = {
  //     '#editor': function (element, renderer) {
  //       return true;
  //     }
  //   };

  //   const table = this.paymenttable.nativeElement;

  //   doc.html(table.innerHTML{
  //     width:190,
  //     'elementHandlers': specialElementHandlers

  //   });

  // }

}

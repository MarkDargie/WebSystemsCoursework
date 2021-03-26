import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {AuthenticateService} from '../../services/authenticate.service';
import {TransactionService} from '../../services/transaction.service';
import { HttpClient, HttpHeaders, JsonpClientBackend } from '@angular/common/http';
import {user} from '../../models/user.model';
import {transaction} from '../../models/transaction.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ThemeService} from '../../theme/theme.service';

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
    private router: Router,
    private themeService: ThemeService
  ) { }

  // Set Data Storage Object
  user: user;
  transactions: transaction[];
  pending: transaction[];
  sent: transaction[];
  recieved: transaction[];

  confirmed = "confirmed";
  pendingP = "pending";

  /**
   * Called when Component is Initialised
   */
  ngOnInit(): void {

    /**
     * Get Authenticated User: Authenticate Service
     */
    this.authenticateService.GetUserDetails().subscribe((user: user)=>{
      this.user = user;
    });

    /**
     *  Get User Payments: Transaction Service
     */
    this.transactionService.getAllPayments().subscribe((transaction: transaction[])=>{
      this.transactions = transaction.splice(0,10);
    });

    /**
     *  Get Pending User Payments: Transaction Service
     */
    this.transactionService.GetPendingPayments().subscribe((transaction: transaction[])=>{
      this.pending = transaction;
    });

    /**
     *  Get Sent User Payments: Transaction Service
     */
    this.transactionService.getSentPayments().subscribe((transaction: transaction[])=>{
      this.sent = transaction;
    });

      /**
     *  Get Received User Payments: Transaction Service
     */
    this.transactionService.getReceivedPayments().subscribe((transaction: transaction[])=>{

      this.recieved = transaction;

    });

  }




}

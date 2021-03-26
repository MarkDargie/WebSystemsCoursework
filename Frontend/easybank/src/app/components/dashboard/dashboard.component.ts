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
    });

  }




}

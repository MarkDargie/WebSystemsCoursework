import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient, private router: Router) {}

  sendPayment(){

  }

  getAllPayments(){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.get(`${environment.API}/transactions/history`, {headers: headers});

  }

  getRecentPayments(){
    
  }

  createPaymentMethod(){

  }



}

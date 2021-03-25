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

  // Get all user transactions
  getAllPayments(){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.get(`${environment.API}/transactions/history`, {headers: headers});

  }

  // Get all user received transactions
  getReceivedPayments(){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.get(`${environment.API}/transactions/received`, {headers: headers});

  }

  // Get all user sent transactions
  getSentPayments(){
    
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.get(`${environment.API}/transactions/sent`, {headers: headers});

  }

  // Get all user pending transactions
  GetPendingPayments(){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.get(`${environment.API}/transactions/pending`, {headers: headers});

  }

  // send secure payment
  securePayment(reqObject: object){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.post(`${environment.API}/transactions/secure`, reqObject, {headers:headers});

  }

  //send express payment
  expressPayment(reqObject: object){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.post(`${environment.API}/transactions/express`, reqObject, {headers:headers});

  }

  //confirm pending payment
  confirmPending(reqObject: object){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.post(`${environment.API}/transactions/confirm`, reqObject, {headers:headers});

  }

  // create payment method 
  createPaymentMethod(reqObject: object){

  }

  EmailRequest(payload: FormData){

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    return this.http.post(`${environment.API}/email/send`, payload);

  }



}

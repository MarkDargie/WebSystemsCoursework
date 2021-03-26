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

  /**
   * Get all user transactions
   * @returns http GET: User Transactions Response
   */
  getAllPayments(){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.get(`${environment.API}/transactions/history`, {headers: headers});
  }

  /**
   * Get all user received transactions
   * @returns http GET: User Received Transactions Response
   */
  getReceivedPayments(){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.get(`${environment.API}/transactions/received`, {headers: headers});
  }

  /**
   * Get all user sent transactions
   * @returns http GET: User Sent Transactions Response
   */
  getSentPayments(){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.get(`${environment.API}/transactions/sent`, {headers: headers});
  }

  /**
   * Get all user pending transactions
   * @returns http GET: User Pending Transactions Response
   */
  GetPendingPayments(){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.get(`${environment.API}/transactions/pending`, {headers: headers});
  }

  /**
   * Send Secure Payment Request
   * @param reqObject form data from secure payment fields
   * @returns http POST: Secure Transacion Response
   */
  securePayment(reqObject: object){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.post(`${environment.API}/transactions/secure`, reqObject, {headers:headers});
  }

  /**
   * Send Express Payment Request
   * @param reqObject form data from express payment fields
   * @returns http POST: Express Transacion Response
   */
  expressPayment(reqObject: object){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.post(`${environment.API}/transactions/express`, reqObject, {headers:headers});
  }

  /**
   * Confirm Pending Payment Request
   * @param reqObject transaction ID & from username
   * @returns http POST: Confirm Transaction Response
   */
  confirmPending(reqObject: object){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.post(`${environment.API}/transactions/confirm`, reqObject, {headers:headers});
  }

  /**
   * Reject Pending Payment Request
   * @param reqObject transaction ID & from username
   * @returns http POST: Reject Transaction Response
   */
  rejectPending(reqObject: object){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.post(`${environment.API}/transactions/reject`, reqObject, {headers:headers});
  }

  /**
   * Create payment method request
   * @param reqObject payment method details from form data
   * @returns http POST: Create Payment Method Response
   */
  createPaymentMethod(reqObject: object){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.post(`${environment.API}/users/paymentmethod`, reqObject, {headers: headers});
  }

  /**
   * Create Email Request
   * @param payload PDF File data of user transactions history
   * @returns http POST: Email Response
   */
  EmailRequest(payload: FormData){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.post(`${environment.API}/email/send`, payload);
  }



}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TestingService {
  constructor(private http: HttpClient) {}

  /**
   * Get all A/B Testing Results from API
   * @returns http GET: Test Object
   */
  GetTestingResults() {
    return this.http.get(`${environment.API}/logs/results`);
  }

  /**
   * Reset All Test Results
   * @returns http POST: Removes Object
   */
  ResetMetrics() {
    return this.http.post(`${environment.API}/logs/reset`, null);
  }

  /**
   * Increment number of secure payments
   * @returns http POST: Secure Payment
   */
  PostSecurePayment() {
    return this.http.post(`${environment.API}/logs/secure`, null);
  }

  /**
   * Increment number of express payments
   * @returns http POST: Express Payment
   */
  PostExpressPayment() {
    return this.http.post(`${environment.API}/logs/express`, null);
  }

  /**
   * Increment number of direct statements
   * @returns http POST: Direct Statement request
   */
  PostAppStatement() {
    return this.http.post(`${environment.API}/logs/appstatement`, null);
  }

  /**
   * Increment number of external statements
   * @returns http POST: External Statement Request
   */
  PostExternalStatement() {
    return this.http.post(`${environment.API}/logs/externalstatement`, null);
  }

  /**
   * Increment nubmer of users with light theme preference
   * @returns http POST: User Preference
   */
  PostLightTheme() {
    return this.http.post(`${environment.API}/logs/lighttheme`, null);
  }

  /**
   * Increment nubmer of users with dark theme preference
   * @returns http POST: User Preference
   */
  PostDarkTheme() {
    return this.http.post(`${environment.API}/logs/darktheme`, null);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  constructor(
    private http: HttpClient
  ) { }

  
  dailyForecast() {
    return this.http.get('http://samples.openweathermap.org/data/2.5/history/city?q=Warren,OH&appid=b6907d289e10d714a6e88b30761fae22')
    .pipe(map(data => {})).subscribe(result => result);
  }

  GetTestingResults(){
    return this.http.get(`${environment.API}/logs/results`);
  }

  ResetMetrics(){
    return this.http.post(`${environment.API}/logs/reset`, null);
  }

  PostSecurePayment(){
    return this.http.post(`${environment.API}/logs/secure`, null);
  }

  PostExpressPayment(){
    return this.http.post(`${environment.API}/logs/express`, null);
  }

  PostAppStatement(){
    return this.http.post(`${environment.API}/logs/appstatement`, null);
  }

  PostExternalStatement(){
    return this.http.post(`${environment.API}/logs/externalstatement`, null);
  }

  PostLightTheme(){
    return this.http.post(`${environment.API}/logs/lighttheme`, null);
  }

  PostDarkTheme(){
    return this.http.post(`${environment.API}/logs/darktheme`, null);
  }


}

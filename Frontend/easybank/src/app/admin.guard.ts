import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService} from './services/authenticate.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticateService: AuthenticateService
  ){}

  canActivate():Observable<boolean> | Promise<boolean> | boolean{

    // return true;
    return this.authenticateService.isAdmin().pipe(
      map((res)=>{
        return res.success;
      }),
      catchError((error) => {
        this.router.navigate(['dashboard']);
        return of(false);
      })
    );
    }
  
}

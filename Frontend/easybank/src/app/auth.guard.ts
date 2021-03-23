import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { promise } from 'protractor';
import { AuthenticateService} from './services/authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticateService: AuthenticateService
  ){}

  authenticated: boolean;

  canActivate():Observable<boolean> | Promise<boolean> | boolean{

    return true;
    // return this.authenticateService.isAuthenticated().pipe(
    //   map((res)=>{
    //     return res.success;
    //   }),
    //   catchError((error) => {
    //     this.router.navigate(['login']);
    //     return of(false);
    //   })
    // );
    }
  
}

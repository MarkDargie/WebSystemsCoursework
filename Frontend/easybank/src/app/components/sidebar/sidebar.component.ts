import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import {AuthenticateService} from '../../services/authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  auth: boolean;

  constructor(
    private authenticateService: AuthenticateService,
    private router: Router
  ) { }

  ngOnInit(): void {

    /**
     * Validate if current user is authenticated
     */
    this.authenticateService.isAdminLoggedIn().pipe(
      tap(()=> {
        this.auth = this.authenticateService.adminLog.value;
      })
    ).subscribe();


  }

  /**
   * Send sign out requst to Authenticate Service
   */
  SignOut(){

    this.authenticateService.logout();
    this.router.navigate(['home']);

  }

}

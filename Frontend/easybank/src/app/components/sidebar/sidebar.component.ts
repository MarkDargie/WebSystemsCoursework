import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import {AuthenticateService} from '../../services/authenticate.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  auth: boolean;

  constructor(
    private authenticateService: AuthenticateService
  ) { }

  ngOnInit(): void {

    this.authenticateService.isAdminLoggedIn().pipe(
      tap(()=> {
        this.auth = this.authenticateService.adminLog.value;
      })
    ).subscribe();


  }

}

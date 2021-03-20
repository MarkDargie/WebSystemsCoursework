import { Component, OnInit } from '@angular/core';
import {AuthenticateService} from '../../services/authenticate.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {user} from '../../models/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private authenticateService: AuthenticateService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  user: user;

  ngOnInit(): void {

  }

}

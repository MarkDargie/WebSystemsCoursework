import { Component, OnInit } from '@angular/core';
import {TestingService} from '../../services/testing.service';
import {Chart} from 'chart.js';
import {test} from '../../models/test.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private testingService: TestingService
  ) { }

  chart = [];

  paypiechart = [];

  transferpiechart = [];

  themechart = [];

  test: test;

  ngOnInit(): void {

    this.testingService.GetTestingResults().subscribe((test : test)=>{
      this.test = test;
      console.log(this.test);

      // Payment Method Pie Chart
      this.paypiechart = new Chart('paypiechart', {
        type:'pie',
        data: {
          labels:["Secure Payment", "Express Payment"],
          datasets: [{
            label: "User Payment Methods",
            backgroundColor: ["#0088c7", "#fd4b4b"],
            data: [this.test.securepayments, this.test.expresspayments]
          }]
        },
        options: {
          title: {
            display: true,
            text: 'User Payment Method Preference'
          },
          maintainAspectRatio: false
        }
  
      });

      //Statement Chart
      this.transferpiechart = new Chart('transferpiechart', {
        type:'pie',
        data: {
          labels:["Direct Download", "Sent Via Email"],
          datasets: [{
            label: "Transfer Statement Methods",
            backgroundColor: ["#0088c7", "#fd4b4b"],
            data: [this.test.externalstatements, this.test.appstatements]
          }]
        },
        options: {
          title: {
            display: true,
            text: 'User Statement Method Preference'
          },
          maintainAspectRatio: false
        }
  
      });

      this.themechart = new Chart('themechart', {
        type:'pie',
        data: {
          labels:["Light Theme", "Dark Theme"],
          datasets: [{
            label: "Dashboard Theme Preference",
            backgroundColor: ["#0088c7", "#fd4b4b"],
            data: [this.test.lighttheme, this.test.darktheme]
          }]
        },
        options: {
          title: {
            display: true,
            text: 'User Statement Method Preference'
          },
          maintainAspectRatio: false
        }
  
      });



    });

  }


}

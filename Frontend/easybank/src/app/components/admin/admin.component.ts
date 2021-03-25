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

  piechart = [];

  test: test;

  ngOnInit(): void {

    this.testingService.GetTestingResults().subscribe((test : test)=>{
      this.test = test;
      console.log(this.test);

      this.piechart = new Chart('piechart', {
        type:'pie',
        data: {
          labels:["Secure Payment", "Express Payment"],
          datasets: [{
            label: "User Payment Methods",
            backgroundColor: ["#3cba9f", "#ffcc00"],
            data: [this.test.securepayments, this.test.expresspayments]
          }]
        },
        options: {
          title: {
            display: true,
            text: 'User Payment Method Preference'
          }
        }
  
      });

    });

    // let testl: string[] = ['one','two', 'three'];
    // let sets: number[] = [1, 2, 4];
    // let sets2: number[] = [3, 5, 4];

    // this.chart = new Chart('canvas', {
    //   type:'line',
    //   data: {
    //     labels: testl,
    //     datasets: [
    //       {
    //       data: sets,
    //       borderColor: '#3cba9f',
    //       fill: false
    //     },
    //     {
    //       data: sets2,
    //       borderColor: '#ffcc00',
    //       fill: false
    //     }
      
    //   ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         display: true
    //       }],
    //       yAxis: [{
    //         display:true
    //       }]
    //     }
    //   }
    // })

  }

  // ngAfterViewInit(){


  // }

}

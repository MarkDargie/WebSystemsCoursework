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

  groupedchart = [];

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
            backgroundColor: ["#3cba9f", "#ffcc00"],
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
            backgroundColor: ["#3cba9f", "#ffcc00"],
            data: [4, 7]
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

      //grouped bar chart
      this.groupedchart = new Chart('groupedchart', {

        type: 'bar',
        data: {
          labels: ["Light", "Dark"],
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: [this.test.lighttheme, this.test.darktheme]
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          },
          maintainAspectRatio: false
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

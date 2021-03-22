import { Component, OnInit } from '@angular/core';
import {TestingService} from '../../services/testing.service';
import {Chart} from 'chart.js';

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


  ngOnInit(): void {

    let testl: string[] = ['one','two', 'three'];
    let sets: number[] = [1, 2, 4];
    let sets2: number[] = [3, 5, 4];

    this.chart = new Chart('canvas', {
      type:'line',
      data: {
        labels: testl,
        datasets: [
          {
          data: sets,
          borderColor: '#3cba9f',
          fill: false
        },
        {
          data: sets2,
          borderColor: '#ffcc00',
          fill: false
        }
      
      ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxis: [{
            display:true
          }]
        }
      }
    })

  }

}

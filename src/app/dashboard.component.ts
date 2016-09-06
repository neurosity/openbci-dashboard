import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bci-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  title = 'BCI Dashboard';
  
  constructor () {
  }
  
  ngOnInit () {
  }
  
}

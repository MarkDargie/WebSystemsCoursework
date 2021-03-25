import { Component } from '@angular/core';
import { ThemeService } from './theme/theme.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'easybank';
  constructor(private themeService: ThemeService){}

  ngOnInit() {

    this.themeService.getTheme();

  }

}




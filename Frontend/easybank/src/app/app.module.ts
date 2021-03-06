import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthenticateService} from './services/authenticate.service';
import {AuthInterceptor} from './services/auth.interceptor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminComponent } from './components/admin/admin.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material Imports
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    LoginComponent,
    FooterComponent,
    RegisterComponent,
    SidebarComponent,
    AdminComponent,
    TransferComponent,
    SettingsComponent,
    PaymentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule

  ],
  providers: [
    AuthenticateService, {
      provide:HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

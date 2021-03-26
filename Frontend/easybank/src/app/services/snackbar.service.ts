import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarOptions } from '../models/snackBarOptions.model';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  open(options: SnackBarOptions): void {
    const snackBarType = options.error 
      ? 'error-snackbar' 
      : 'success-snackbar';

    this.snackBar.open(options.message, 'Close', {
      duration: 4000,
      panelClass: [
        snackBarType
      ]
    });
  }
}
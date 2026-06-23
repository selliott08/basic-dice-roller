import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MAT_DIALOG_DATA,} from '@angular/material/dialog';
import {SafeHtmlPipe} from '../safe-html.pipe'

export interface AppRollDialogInput {
    title: string;
    content: string;
}

@Component({
    standalone: true,
    selector: 'app-roll-dialog',
    templateUrl: './app-roll-dialog.component.html',
    styleUrl: './app-roll-dialog.component.scss',
    imports: [MatDialogModule, MatButtonModule, SafeHtmlPipe],
  })
  export class AppRollDialogComponent {
    data: AppRollDialogInput = inject(MAT_DIALOG_DATA);
  }
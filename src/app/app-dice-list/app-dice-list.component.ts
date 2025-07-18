import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AppDiceComponent } from '../app-dice/app-dice.component';
import { RollModel } from '../../db/roll';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dice-list',
  standalone: true,
  templateUrl: './app-dice-list.component.html',
  styleUrl: './app-dice-list.component.scss',
  imports: [
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    AppDiceComponent,
  ],
})
export class AppDiceListComponent {
  public dice: RollModel[] = [];

  constructor(public dialog: MatDialog) {}

  fgFilter = new FormGroup({
    search: new FormControl<string>(''),
  });

  openRollDialog() {
    const dialogRef = this.dialog.open(AppDiceComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

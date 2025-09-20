import { Component, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AppDiceComponent } from '../app-dice/app-dice.component';
import { RollModel } from '../../db/roll';
import { MatDialog } from '@angular/material/dialog';
import { AppDiceListElemComponent } from '../app-dice-list-elem/app-dice-list-elem.component';
import { AppService } from '../app.service';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';

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
    AppDiceListElemComponent
  ],
})
export class AppDiceListComponent {
  public _dice: RollModel[] = [];
  public dice: RollModel[] = [];

  fgFilter = new FormGroup({
    search: new FormControl<string>(''),
  });

  constructor(
    public dialog: MatDialog,
    private appSvc: AppService
  ) {
    toObservable(this.appSvc.character$).subscribe({
      next: (char) => {
        this._dice = char?.rolls ?? [];
        this.doSearch();
      }
    });

    this.fgFilter.controls.search.valueChanges.subscribe({
      next: (v) => {
        this.doSearch();
      }
    });
  }

  doSearch() {
    let srchVal = (this.fgFilter.controls.search.value + '').toLowerCase();
    this.dice = this._dice.filter(el => {
      return el.name?.toLowerCase().includes(srchVal) || el.description?.toLowerCase().includes(srchVal) 
    });
  }

  openRollDialog() {
    const dialogRef = this.dialog.open(AppDiceComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onDelete(id: number) {
    console.log('delete', id);
  }

  onEdit(id: number) {
    console.log('edit', id);
  }
}

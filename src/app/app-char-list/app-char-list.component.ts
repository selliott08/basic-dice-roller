import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CharacterModel } from '../../db/character';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppCharacterComponent } from '../app-char/app-char.component';

@Component({
  selector: 'app-char-list',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './app-char-list.component.html',
  styleUrl: './app-char-list.component.scss',
})
export class AppCharacterListComponent {
  public list: CharacterModel[] = [
    {
      id: 1,
      name: 'smith',
      classes: [],
      rolls: [],
    },
  ];

  constructor(public dialog: MatDialog) {}

  openCharacterDialog() {
    const dialogRef = this.dialog.open(AppCharacterComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

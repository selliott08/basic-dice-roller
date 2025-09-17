import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CharacterModel } from '../../db/character';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppCharacterComponent } from '../app-char/app-char.component';
import { db } from '../../db/db';
import { liveQuery } from 'dexie';
import { AsyncPipe } from '@angular/common';
import { AppService } from '../app.service';

@Component({
  selector: 'app-char-list',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    AsyncPipe
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

  public list$ = liveQuery(() => this.listCharacters());

  constructor(
    private appSvc: AppService,
    public dialog: MatDialog
  ) {}

  openCharacterDialog(id : number | null = null) {
    const dialogRef = this.dialog.open(AppCharacterComponent, { data: { id } });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteCharacter(id : number | null = null) {
    if (id) {
      db.characterClasses.where('characterId').equals(id).delete();
      db.characters.delete(id);
    }
  }

  selectCharacter(id : number | null = null) {
    if (id) {
      this.appSvc.LoadCharacter(id);
    }
  }

  async listCharacters() {
    //
    // Query the DB using our promise based API.
    // The end result will magically become
    // observable.
    //
    return await db.characters.toArray();
  }
}

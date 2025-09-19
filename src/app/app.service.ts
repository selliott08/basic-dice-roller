import { Injectable, signal } from '@angular/core';
import { CharacterModel } from '../db/character';
import { liveQuery } from 'dexie';
import { db } from '../db/db';
import { forkJoin, from, mergeMap, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  private _character: CharacterModel | null = null;

  public characterList$ = liveQuery(() => db.characters.toArray());
  public character$ = signal<CharacterModel | null>(null);

  public get character(): CharacterModel | null {
    return this._character;
  }

  public set character(val: CharacterModel | null) {
    this._character = val;
    if (this._character != null) {
      liveQuery(() =>
        db.rolls
          .where('characterId')
          .equals(this._character?.id ?? -1)
          .toArray()
      ).subscribe({
        next: (results) => {
          if (this._character) {
            this._character.rolls = results;
          }
          this.character$.set(this._character);
        },
      });
    }
  }

  public LoadCharacter(charId: number) {
    db.characters.where('id').equals(charId).first().then(char => {
      this.character = char ?? null;
    })
  }

  constructor() {
    this.characterList$.subscribe({
      next: (characters) => {
        this.character = characters.shift() ?? null;
      }
    });
  }
}

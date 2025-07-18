import { Injectable } from '@angular/core';
import { CharacterModel } from '../db/character';
import { liveQuery } from 'dexie';
import { db } from '../db/db';
import { forkJoin, from, mergeMap, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  private _character: CharacterModel | null = null;

  public characterList$ = liveQuery(() => db.characters.toArray());

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
        },
      });
    }
  }

  public SaveCharacter(char: CharacterModel): Observable<any> {
    return from(db.characters.put(char))
      .pipe(
        mergeMap((id) => {
          char.classes?.forEach((fel) => {
            fel.characterId = id;
          });
          return from(
            db.characterClasses.where('characterId').equals(id).toArray()
          );
        })
      )
      .pipe(
        mergeMap((classes) => {
          // clean up old classes
          let classIds: number[] = classes
            .map((m) => m.id)
            .filter((fel) => fel !== undefined);
          return from(db.characterClasses.bulkDelete(classIds));
        })
      )
      .pipe(
        mergeMap(() => {
          let classesToSave = char.classes ?? [];

          return db.characterClasses.bulkAdd(classesToSave);
        })
      );
  }

  constructor() {}
}

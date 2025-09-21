import { Injectable, signal } from '@angular/core';
import { CharacterModel } from '../db/character';
import { liveQuery } from 'dexie';
import { db } from '../db/db';
import { forkJoin, from, map, mergeMap, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  private _character: CharacterModel | null = null;

  public notes: any[] = [];
  public characterList$ = liveQuery(() => db.characters.toArray());
  public character$ = signal<CharacterModel | null>(null);

  public get character(): CharacterModel | null {
    return this._character;
  }

  public set character(val: CharacterModel | null) {
    if (val != null) {
      this.LoadRolls(val).subscribe({
        next: (char) => {
          this._character = char;
          this.character$.set(this._character);
        }
      });
    }
  }

  public LoadCharacter(charId: number) {
    db.characters.where('id').equals(charId).first().then(char => {
      this.character = char ?? null;
    })
  }

  public LoadRolls(char: CharacterModel): Observable<CharacterModel> {
    return from(
      db.rolls
      .where('characterId')
      .equals(char?.id ?? -1)
      .toArray()
    ).pipe(mergeMap((results) => {
      if (char) {
        char.rolls = results;
      }
      return this.LoadRollElements(char);
    }));
  }

  public LoadRollElements(char: CharacterModel): Observable<CharacterModel> {
    const rollIdList: number[] = (char?.rolls?.map(m => m.id) as number[]) ?? ([] as number[]);
    return from(
      db.rollElements.where('rollId').anyOf(rollIdList).toArray()
    ).pipe(map((results) => {
      if (char) {
        char.rolls?.forEach(roll => {
          roll.elements = results?.filter(fel => fel.rollId === roll.id) ?? [];
        })
      }
      return char;
    }));
  }

  public addNotes(a: any) {
    this.notes.unshift(a);
  }

  constructor() {
    this.characterList$.subscribe({
      next: (characters) => {
        if (characters && characters.length > 0) {
          this.character = characters[0];
        }
      }
    });
  }
}

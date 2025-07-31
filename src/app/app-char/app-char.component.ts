import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { db } from '../../db/db';
import { CharacterClassModel } from '../../db/character';
import { forkJoin, from } from 'rxjs';

@Component({
  selector: 'app-char',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIcon,
  ],
  templateUrl: './app-char.component.html',
  styleUrl: './app-char.component.scss',
})
export class AppCharacterComponent {
  title = 'New Character';
  characterId: number|null = null;

  fgChar = new FormGroup({
    name: new FormControl<string>('', { validators: Validators.required }),
    classes: new FormArray<FormGroup>([
      new FormGroup({
        id: new FormControl(),
        class: new FormControl(),
        level: new FormControl(),
      }),
    ]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: number | null},
    private dialogRef: MatDialogRef<AppCharacterComponent>
  ) 
  {
    this.deleteCharacterClass(0);
    this.addCharacterClass();

    if (data?.id) {
      this.characterId = data.id;
      forkJoin({
        char: from(db.characters.where("id").equals(data.id).first()),
        classes: from(db.characterClasses.where("characterId").equals(data.id).toArray())
      })
      .subscribe({
        next: (x) => {
          if (x.char) {
            this.deleteCharacterClass(0);
            this.fgChar.controls.name.setValue(x.char.name);
            x.classes.forEach((c, i) => {
              this.addCharacterClass();
              let elem = this.fgChar.controls.classes.at(i);
              elem.controls['id'].setValue(c.id);
              elem.controls['class'].setValue(c.class);
              elem.controls['level'].setValue(c.level);
            });
          }
        }
      })
    }
  }

  private classGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl<number | null>(null),
      class: new FormControl<string>('', { validators: Validators.required }),
      level: new FormControl<number>(1, { validators: Validators.required }),
    });
  }

  public addCharacterClass(): void {
    let classes = this.fgChar.controls.classes;
    classes.insert(classes.length, this.classGroup());
  }

  public deleteCharacterClass(i: number): void {
    let classes = this.fgChar.controls.classes;
    classes.removeAt(i);
  }

  public save() {
    this.fgChar.updateValueAndValidity();
    if (!this.fgChar.valid) { return; }
    if (this.characterId) {
      db.characters.update(this.characterId, {
        name: '' + this.fgChar.controls.name.value,
      })
      .then(() => {
        this.saveClasses(this.characterId ?? 0);
      });
    } else {
      db.characters
      .add({
        name: '' + this.fgChar.controls.name.value,
      })
      .then((id) => {
        this.saveClasses(id);  
      });
    }
  }

  private saveClasses(charId: number) {
    const classes: CharacterClassModel[] = [];
    this.fgChar.controls.classes.controls.forEach((el) => {
      if (el.controls['id'].value) 
      {
        db.characterClasses.update(el.controls['id'].value, {
          class: el.controls['class'].value,
          level: el.controls['level'].value,
        });
      }
      else 
      {
        classes.push({
          characterId: charId,
          class: el.controls['class'].value,
          level: el.controls['level'].value,
        });
      }
    });
    db.characterClasses.bulkAdd(classes).then(() => {
      this.dialogRef.close();
    });
  }
}

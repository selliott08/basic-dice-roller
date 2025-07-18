import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { db } from '../../db/db';
import { CharacterClassModel } from '../../db/character';

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

  fgChar = new FormGroup({
    name: new FormControl<string>('', { validators: Validators.required }),
    classes: new FormArray<FormGroup>([
      new FormGroup({
        class: new FormControl(),
        level: new FormControl(),
      }),
    ]),
  });

  constructor(private dialogRef: MatDialogRef<AppCharacterComponent>) {}

  private classGroup(): FormGroup {
    return new FormGroup({
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
    db.characters
      .add({
        name: '' + this.fgChar.controls.name.value,
      })
      .then((id) => {
        const classes: CharacterClassModel[] = [];
        this.fgChar.controls.classes.controls.forEach((el) => {
          classes.push({
            characterId: id,
            class: el.controls['class'].value,
            level: el.controls['level'].value,
          });
        });
        db.characterClasses.bulkAdd(classes).then(() => {
          this.dialogRef.close();
        });
      });
  }
}

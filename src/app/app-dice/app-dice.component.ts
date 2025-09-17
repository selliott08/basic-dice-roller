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
import { RollElementModel } from '../../db/roll';
import { AppService } from '../app.service';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIcon,
  ],
  templateUrl: './app-dice.component.html',
  styleUrl: './app-dice.component.scss',
})
export class AppDiceComponent {
  title = 'New Dice Roll';
  diceId: number|null = null;
  public get characterId(): number | undefined { return this.appSvc?.character?.id; }

  fgRoll = new FormGroup({
    name: new FormControl<string>('', { validators: Validators.required }),
    description: new FormControl<string>(''),
    elements: new FormArray<FormGroup>([
      new FormGroup({
        id: new FormControl(),
        value: new FormControl(),
        damageType: new FormControl(),
      }),
    ]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: number | null},
    private dialogRef: MatDialogRef<AppDiceComponent>,
    private appSvc: AppService
  ) 
  {}

  public get fcName(): FormControl<string | null> {
    return this.fgRoll.controls.name;
  }
  public get fcDescription(): FormControl<string | null> {
    return this.fgRoll.controls.description;
  }
  public get fgElements(): FormArray<FormGroup> {
    return this.fgRoll.controls.elements;
  }

  private elementsGroup(): FormGroup {
    return new FormGroup({
      value: new FormControl<string | null>('', {
        validators: Validators.required,
      }),
      damageType: new FormControl<number | null>(null, {
        validators: Validators.required,
      }),
    });
  }

  public addElement(): void {
    let elements = this.fgElements;
    elements.insert(elements.length, this.elementsGroup());
  }

  public deleteElement(i: number): void {
    let elements = this.fgElements;
    elements.removeAt(i);
  }

  public save() {
    this.fgRoll.updateValueAndValidity();
    if (!this.fgRoll.valid) { return; }
    if (this.diceId) {
      db.rolls.update(this.diceId, {
        name: '' + this.fgRoll.controls.name.value,
        description: '' + this.fgRoll.controls.description.value
      })
      .then(() => {
        this.saveElements(this.diceId ?? 0);
      });
    } else {
      db.rolls
      .add({
        characterId: this.characterId ?? 0,
        name: '' + this.fgRoll.controls.name.value,
        description: '' + this.fgRoll.controls.description.value
      })
      .then((id) => {
        this.saveElements(id);  
      });
    }
  }

  private saveElements(rollId: number) {
    const elements: RollElementModel[] = [];
    this.fgRoll.controls.elements.controls.forEach((el) => {
      if (el.controls['id'].value) 
      {
        db.rollElements.update(el.controls['id'].value, {
          value: el.controls['value'].value,
          damageType: el.controls['damageType'].value,
        });
      }
      else 
      {
        elements.push({
          rollId: rollId,
          value: el.controls['value'].value,
          damageType: el.controls['damageType'].value,
        });
      }
    });
    db.rollElements.bulkAdd(elements).then(() => {
      this.dialogRef.close();
    });
  }
}

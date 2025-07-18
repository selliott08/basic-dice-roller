import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

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

  fgRoll = new FormGroup({
    name: new FormControl<string>('', { validators: Validators.required }),
    description: new FormControl<string>(''),
    elements: new FormArray<FormGroup>([
      new FormGroup({
        value: new FormControl(),
        damageType: new FormControl(),
      }),
    ]),
  });

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
}

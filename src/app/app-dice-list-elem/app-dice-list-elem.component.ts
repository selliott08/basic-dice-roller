import { Component, computed, input, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RollModel } from '../../db/roll';
import { LongPressDirective } from '../longpress.directive';

@Component({
  selector: 'app-dice-list-elem',
  standalone: true,
  templateUrl: './app-dice-list-elem.component.html',
  styleUrl: './app-dice-list-elem.component.scss',
  imports: [
    MatIconModule,
    MatButtonModule,
    LongPressDirective
  ],
})
export class AppDiceListElemComponent {
  public roll = input<RollModel | null>(null);
  public name = computed(() => this.roll()?.name ?? '');
  public desc = computed(() => this.roll()?.description ?? '');
  public editMode = model<boolean>(false);
  public onDelete = output<number>();
  public onEdit = output<number>();

  onLongPress() {
    this.editMode.set(!this.editMode());
  }

  onClick() {
    console.log('on click');
  }

  openDialog() {
    this.onEdit.emit(this.roll()?.id ?? -1);
  }

  delete() {
    this.onDelete.emit(this.roll()?.id ?? -1);
  }
}
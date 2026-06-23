import { Component, computed, input, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RollModel } from '../../db/roll';
import { LongPressDirective } from '../longpress.directive';
import { ConvertString, convertRoll } from '../libs/dice-lib';
import { AppService } from '../app.service';
import { AppRollDialogComponent } from '../app-roll-dialog/app-roll-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private appSvc: AppService,
    public dialog: MatDialog
  ) {}

  onLongPress() {
    this.editMode.set(!this.editMode());
  }

  onClick() {
    let content = '';
    this.roll()?.elements?.forEach(el => {
      let converted: string[] = ConvertString(el.value);
      let updated = [...converted];
      updated[0] = 'Base: ' + updated[0];
      updated[1] = 'Calc: ' + updated[1];
      updated[2] = 'Total: ' + updated[2];
      this.appSvc.addNotes(updated.join(', ') + ' ' + (el.damageType ?? ''));
      content += updated.join('<br />') + ' ' + (el.damageType ?? '') + '<br />';
    });

    content = (this.desc() + (this.desc().trim() === '' ? '' :'<br /><br />') + content).trim(); 
    let dlg = this.dialog.open(AppRollDialogComponent, 
      { 
        data: { title: this.name(), content }
      })
  }

  openDialog() {
    this.onEdit.emit(this.roll()?.id ?? -1);
  }

  delete() {
    this.onDelete.emit(this.roll()?.id ?? -1);
  }
}
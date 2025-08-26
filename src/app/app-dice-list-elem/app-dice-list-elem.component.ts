import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dice-list-elem',
  standalone: true,
  templateUrl: './app-dice-list-elem.component.html',
  styleUrl: './app-dice-list-elem.component.scss',
  imports: [
    MatIconModule,
    MatButtonModule
  ],
})
export class AppDiceListElemComponent {}
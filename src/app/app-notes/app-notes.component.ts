import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { AppService } from "../app.service";

@Component({
  selector: 'app-notes',
  templateUrl: './app-notes.component.html',
  styleUrl: './app-notes.component.scss',
  standalone: true,
  imports: [
    CommonModule
  ],
})
export class AppNotesComponent {
  public get notes(): any[] { return this.appSvc.notes; }
  constructor(private appSvc: AppService) {}
}
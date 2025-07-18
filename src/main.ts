import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { AppLayoutComponent } from './app/app-layout/app-layout.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppLayoutComponent],
  template: `
    <app-layout></app-layout>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App, { providers: [provideAnimations(), provideAnimationsAsync()] });
//bootstrapApplication(App);

import { Directive, ElementRef, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, timer, Subscription } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[longPress]'
})
export class LongPressDirective implements OnInit, OnDestroy {
  @Input() duration = 500; // Default duration in milliseconds
  @Output() longPress = new EventEmitter<void>();

  private subscription!: Subscription;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const mouseDown$ = fromEvent(this.el.nativeElement, 'mousedown');
    const mouseUp$ = fromEvent(this.el.nativeElement, 'mouseup');
    const touchStart$ = fromEvent(this.el.nativeElement, 'touchstart');
    const touchEnd$ = fromEvent(this.el.nativeElement, 'touchend');

    const press$ = mouseDown$.pipe(
      switchMap(() => timer(this.duration).pipe(takeUntil(mouseUp$)))
    );

    const touchPress$ = touchStart$.pipe(
      switchMap(() => timer(this.duration).pipe(takeUntil(touchEnd$)))
    );

    this.subscription = press$.subscribe(() => this.longPress.emit());
    this.subscription.add(touchPress$.subscribe(() => this.longPress.emit()));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
import { Injectable, ComponentRef, ViewContainerRef, ApplicationRef, Injector, ComponentFactoryResolver } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../components/confirmation-dialog/confirmation-dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private dialogRef: ComponentRef<ConfirmationDialogComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    const subject = new Subject<boolean>();

    // Close existing dialog if open
    if (this.dialogRef) {
      this.close();
    }

    // Create component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmationDialogComponent);
    
    // Create injector with dialog data
    const dialogInjector = Injector.create({
      providers: [
        { provide: 'dialogData', useValue: data }
      ],
      parent: this.injector
    });

    // Create component
    this.dialogRef = componentFactory.create(dialogInjector);

    // Handle confirm/cancel events
    const dialogInstance = this.dialogRef.instance;
    
    // Override methods to handle the result
    dialogInstance.onConfirm = () => {
      subject.next(true);
      subject.complete();
      this.close();
    };

    dialogInstance.onCancel = () => {
      subject.next(false);
      subject.complete();
      this.close();
    };

    // Attach to application
    this.appRef.attachView(this.dialogRef.hostView);

    // Append to DOM
    const domElement = (this.dialogRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElement);

    // Focus management for accessibility
    setTimeout(() => {
      const confirmButton = domElement.querySelector('.btn-danger') as HTMLElement;
      if (confirmButton) {
        confirmButton.focus();
      }
    });

    return subject.asObservable();
  }

  private close(): void {
    if (this.dialogRef) {
      this.appRef.detachView(this.dialogRef.hostView);
      this.dialogRef.destroy();
      this.dialogRef = null;
    }
  }
}

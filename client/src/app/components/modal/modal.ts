import { Component, ViewChild, ViewContainerRef, OnInit, OnDestroy, inject } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class ModalComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  protected readonly isVisible = this.modalService.isVisible;

  @ViewChild('modalHost', { read: ViewContainerRef, static: true })
  private host!: ViewContainerRef;

  ngOnInit(): void {
    this.modalService.setHostViewContainerRef(this.host);
  }

  ngOnDestroy(): void {
    this.modalService.clear();
  }

  protected close(): void {
    this.modalService.close();
  }

  protected handleClickOutside(event: MouseEvent): void {
    const { target, currentTarget } = event;
    if (target === currentTarget) {
      event.preventDefault();
      this.close();
    }
  }
}

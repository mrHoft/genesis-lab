import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

import { GalleryService } from '~/api/gallery.service';
import type { GalleryRecord } from '~/api/types';
import { Loader } from '~/app/components/loader/loader';
import { UserService } from '~/api/user.service';
import { ModalService } from '~/app/components/modal';
import { Confirmation, type TConfirmationProps } from '~/app/components/confirmation/confirmation';
import { i18n } from '~/data/i18n.en'

@Component({
  selector: 'app-savings',
  imports: [Loader],
  templateUrl: './savings.html',
  styleUrl: './savings.css'
})
export class PageUserSavings {
  private userService = inject(UserService);
  private galleryService = inject(GalleryService);
  private modalService = inject(ModalService);
  protected loading = signal(false);
  protected savings = signal<GalleryRecord[]>([]);
  private totalRecords = signal(0);
  protected router = inject(Router)
  protected messageNothing = computed<string[]>(() => i18n.noSavings.split('\n'))

  ngOnInit(): void {
    this.loadPage(1);
  }

  public loadPage(page: number): void {
    const userId = this.userService.user()?.id
    if (this.loading()) return;

    this.loading.set(true);
    this.galleryService.get(page, 100, userId).subscribe({
      next: (response) => {
        this.savings.set(response.records);
        this.totalRecords.set(response.pagination.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  public formatDate(date: number) {
    return new Date(date).toISOString().replace('T', ' ').slice(0, 19)
  }

  public handleRemove(id: number) {
    this.modalService.showComponent<boolean, TConfirmationProps>(
      Confirmation,
      { title: "Deletion", message: `Are you sure want to delete selected fractal?` }
    ).then(confirm => {
      if (confirm) {
        this.galleryService.remove(id).subscribe({ next: () => this.savings.update(prev => prev.filter(item => item.id !== id)) })
      }
    })
  }
}

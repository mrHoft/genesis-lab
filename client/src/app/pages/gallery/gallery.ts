import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '~/api/gallery.service';
import type { GalleryRecord } from '~/api/types';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gallery-container">
      @for (item of galleryRecords(); track item.id) {
        <div class="gallery-item">
          <img
            [src]="item.thumbnail"
            alt="thumbnail"
            width="300"
            height="300"
          />
          <span>id: {{item.id}} likes: {{item.likes.length}}</span>
        </div>
      }
      @if (loading()) {
        <div class="loading">Loading more...</div>
      }
    </div>
  `,
  styles: [`
    .gallery-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    .gallery-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .loading {
      grid-column: 1 / -1;
      text-align: center;
      padding: 20px;
    }
  `]
})
export class PageGallery {
  private galleryService = inject(GalleryService);
  private currentPage = signal(1);
  protected loading = signal(false);
  private allRecords = signal<GalleryRecord[]>([]);
  private totalRecords = signal(0);

  public galleryRecords = computed(() => this.allRecords());

  ngOnInit(): void {
    this.loadNextPage();
  }

  @HostListener('window:scroll')
  public onScroll(): void {
    const threshold = 100;
    const position = window.scrollY + window.innerHeight;
    const height = document.body.scrollHeight;

    if (position > height - threshold) {
      this.loadNextPage();
    }
  }

  public loadNextPage(): void {
    const total = this.totalRecords()
    if (this.loading() || (total && this.allRecords().length >= total)) return;

    this.loading.set(true);
    this.galleryService.get(this.currentPage()).subscribe({
      next: (response) => {
        this.allRecords.update(current => [...current, ...response.records]);
        this.totalRecords.set(response.pagination.total);
        this.currentPage.update(page => page + 1);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}

import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { GalleryService } from '~/api/gallery.service';
import type { GalleryRecord } from '~/api/types';
import { Loader } from '~/app/components/loader/loader';
import { UserService } from '~/api/user.service';

@Component({
  selector: 'app-gallery',
  imports: [Loader],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class PageGallery {
  private userService = inject(UserService);
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

  public isLiked(likes: string[]) {
    const userId = this.userService.user()?.id
    return userId && likes.includes(userId)
  }

  public handleLike(id: number) {
    this.galleryService.like(id).subscribe({ next: this.updateRecords })
  }

  private updateRecords = (galleryData: GalleryRecord) => {
    this.allRecords.update(prev => {
      return prev.map(record => {
        if (record.id === galleryData.id) {
          const version = (record.version || 0) + 1
          return { ...galleryData, version }
        }
        return record
      })
    });
  }
}

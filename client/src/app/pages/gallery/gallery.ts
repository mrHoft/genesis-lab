import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GalleryService } from '~/api/gallery.service';
import type { GalleryRecord, FractalData, GalleryResponse } from '~/api/types';
import { Loader } from '~/app/components/loader/loader';
import { UserService } from '~/api/user.service';
import { Fractal } from '~/app/utils/fractal';
import { GALLERY_IMAGE_SIZE } from '~/data/const';

@Component({
  selector: 'app-gallery',
  imports: [Loader],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class PageGallery {
  private route = inject(ActivatedRoute);
  protected router = inject(Router)
  private fractal: Fractal
  private userService = inject(UserService);
  private galleryService = inject(GalleryService);
  private currentPage = signal(1);
  protected loading = signal(false);
  private allRecords = signal<GalleryRecord[]>([]);
  private totalRecords = signal(0);

  public galleryRecords = computed(() => this.allRecords());
  public size = GALLERY_IMAGE_SIZE

  constructor() {
    this.fractal = new Fractal()
  }

  ngOnInit() {
    // this.loadNextPage();  // Without route resolver
    this.route.data.subscribe(data => {
      const response = data['galleryFirstPage'] as GalleryResponse
      if (response) {
        this.allRecords.update(current => [...current, ...response.records]);
        this.totalRecords.set(response.pagination.total);
        this.currentPage.set(response.pagination.page + 1);

        setTimeout(() => this.renderFractals(response.records));
      }
    });
  }

  @HostListener('window:scroll')
  public onScroll() {
    const threshold = 100;
    const position = window.scrollY + window.innerHeight;
    const height = document.body.scrollHeight;

    if (position > height - threshold) {
      this.loadNextPage();
    }
  }

  public loadNextPage() {
    const total = this.totalRecords()
    if (this.loading() || (total && this.allRecords().length >= total)) return;

    this.loading.set(true);
    this.galleryService.get(this.currentPage()).subscribe({
      next: (response) => {
        this.allRecords.update(current => [...current, ...response.records]);
        this.totalRecords.set(response.pagination.total);
        this.currentPage.update(page => page + 1);
        this.loading.set(false);

        setTimeout(() => this.renderFractals(response.records));
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private renderFractals(records: GalleryRecord[]) {
    const canvases = document.querySelectorAll('canvas');
    records.forEach((record, index) => {
      const canvas = canvases[canvases.length - records.length + index];
      if (canvas) {
        this.renderFractalToCanvas(canvas, record.props);
      }
    });
  }

  private renderFractalToCanvas(canvas: HTMLCanvasElement, props: FractalData) {
    const imageData = this.fractal.render(props, this.size, this.size);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.putImageData(imageData, 0, 0);
    }
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

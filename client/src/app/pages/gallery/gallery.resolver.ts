import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { GalleryService } from '~/api/gallery.service';
import { GalleryResponse } from '~/api/types';
import { PAGE_SIZE } from '~/data/const';

@Injectable({ providedIn: 'root' })
export class GalleryResolver implements Resolve<GalleryResponse> {
  private galleryService = inject(GalleryService);

  resolve(): Observable<GalleryResponse> {
    return this.galleryService.get(1, PAGE_SIZE * 2)
  }
}

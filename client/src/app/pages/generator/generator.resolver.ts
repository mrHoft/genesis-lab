import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GalleryService } from '~/api/gallery.service';
import { GalleryRecord } from '~/api/types';

@Injectable({ providedIn: 'root' })
export class GeneratorResolver implements Resolve<GalleryRecord | null> {
  private galleryService = inject(GalleryService);

  resolve(route: ActivatedRouteSnapshot): Observable<GalleryRecord | null> {
    const id = route.paramMap.get('id');

    if (id) {
      return this.galleryService.getOne(Number(id)).pipe(
        catchError(error => {
          console.error('Error loading generator data:', error);
          return of(null);
        })
      );
    }

    return of(null);
  }
}

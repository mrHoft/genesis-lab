import type { TFractalType } from '~/data/fractal';
import type { TPaletteName } from '~/data/palette';

export interface User {
  id: string,
  name: string,
  login: string,
  settings: Record<string, string>,
  accessToken?: string,
  refreshToken?: string,
}

export interface GalleryRecord {
  id: number
  thumbnail: string
  props: FractalData
  likes: string[]
  version?: number
  created_at: number
}

export interface FractalData {
  fractal: TFractalType
  p1: number
  p2: number
  scale: number
  x: number
  y: number
  palette: TPaletteName
  invert: boolean
  fill: boolean
}

export interface GalleryResponse {
  records: GalleryRecord[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}

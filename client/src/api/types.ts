import { type TFractalType } from '~/data/fractal';

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
}

export interface FractalData {
  fractal: TFractalType
  p1: number
  p2: number
  scale: number
  x: number
  y: number
  palette: number
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

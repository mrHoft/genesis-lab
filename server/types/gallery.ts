export interface Gallery {
  id: number
  user_id: string
  thumbnail: string
  props: Record<string, string>
  likes: string[]
  created_at: number
}

import type { User } from './user'

export interface Comment {
  id: number
  post_id: number
  parent_comment_id: number | null
  content: string
  created_at: string
  updated_at: string
  user: User
  replies?: Comment[]
}
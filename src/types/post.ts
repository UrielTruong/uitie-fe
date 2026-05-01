export interface CreatePostPayload {
    content?: string
    visibility?: 'Public' | 'Private'
    category_id?: number
  }
  
  export interface Post {
    id: number
    content: string | null
    visibility: 'Public' | 'Private'
    status: 'Pending' | 'Accepted' | 'Rejected'
    is_edited: boolean
    created_at: string
    author: {
      id: number
      full_name: string
      email: string
    }
    category: {
      id: number
      category_name: string
    } | null
  }
export interface Building {
  id: number
  name: string
  location: string
  category: string
  description: string | null
  image: string | null
  rating: number
  checkin_count: number
  latitude: number | null
  longitude: number | null
  created_at: string
}

export interface CheckIn {
  id: number
  user_id: string
  building_id: number
  note: string | null
  image_url: string | null
  likes_count: number
  comments_count: number
  created_at: string
  building?: Building
  profile?: Profile
}

export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export interface Favorite {
  id: number
  user_id: string
  building_id: number
  created_at: string
}

export interface Achievement {
  id: number
  name: string
  description: string | null
  icon: string | null
  requirement: number
  type: string
}

export interface Course {
  id: number
  title: string
  description: string | null
  cover_image: string | null
  category: string | null
  duration: number
}

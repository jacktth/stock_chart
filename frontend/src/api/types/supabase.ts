export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      apikeys: {
        Row: {
          api_key: string
          created_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
      }
      categories: {
        Row: {
          created_at: string | null
          default: boolean
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default: boolean
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          default?: boolean
          id?: number
          name?: string
          user_id?: string
        }
      }
      clip: {
        Row: {
          category: string
          category_id: number
          created_at: string | null
          ending: number | null
          id: number
          market: string
          starting: number | null
          symbol: string
          user_id: string
        }
        Insert: {
          category: string
          category_id: number
          created_at?: string | null
          ending?: number | null
          id?: number
          market?: string
          starting?: number | null
          symbol: string
          user_id: string
        }
        Update: {
          category?: string
          category_id?: number
          created_at?: string | null
          ending?: number | null
          id?: number
          market?: string
          starting?: number | null
          symbol?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_api_key: {
        Args: {
          id: string
        }
        Returns: string
      }
      update_user_api_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


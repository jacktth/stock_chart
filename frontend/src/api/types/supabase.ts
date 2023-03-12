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
      categories: {
        Row: {
          created_at: string | null
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          user_id?: string
        }
      }
      clip: {
        Row: {
          category: string | null
          created_at: string | null
          ending: number | null
          id: number
          market: string
          starting: number | null
          symbol: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          ending?: number | null
          id?: number
          market?: string
          starting?: number | null
          symbol: string
          user_id: string
        }
        Update: {
          category?: string | null
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

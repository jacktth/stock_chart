/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_REACT_APP_SUPABASE_URL: string
    readonly VITE_REACT_APP_SUPABASE_ANON_KEY: string
    readonly VITE_SERVER: string
    readonly REACT_APP_A: string

    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
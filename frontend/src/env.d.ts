/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_REACT_APP_SUPABASE_URL: string
    readonly VITE_REACT_APP_SUPABASE_ANON_KEY: string
    readonly VITE_SERVER: string
    readonly VITE_Vistor_email: string
    readonly VITE_Vistor_Password: string

    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
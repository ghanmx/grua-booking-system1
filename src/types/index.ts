// Global type declarations
declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_PROJECT_URL: string;
    readonly VITE_SUPABASE_API_KEY: string;
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
    readonly VITE_GOOGLE_MAPS_ID: string;
    readonly VITE_TOLLGURU_API_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Export empty object to make this a module
export {};
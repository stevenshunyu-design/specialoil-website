/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID: string
  readonly VITE_HCAPTCHA_SITE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

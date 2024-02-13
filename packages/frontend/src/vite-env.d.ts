/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'dev' | 'prod'
  readonly API_URL_PROD: string
  readonly API_URL_DEV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
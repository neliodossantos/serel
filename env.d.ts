/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BASE_URL: string
    // Add other environment variables you're using
    // For example:
    // readonly VITE_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
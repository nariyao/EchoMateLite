/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly EML_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

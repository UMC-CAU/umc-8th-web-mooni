/// <reference types="vite/client" />

interface ImporMetaEnv {
    readonly VITE_SERVER_API_URL: string;
}

interface ImporMeta {
    readonly env: ImporMetaEnv;
}
interface ImportMetaEnv {
  readonly VITE_WEATHER_API_KEY: string;
  readonly VITE_IPDATA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

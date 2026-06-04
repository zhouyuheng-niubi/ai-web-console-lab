/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LABEL_SYS: string
  readonly VITE_XCLABEL_SYS: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
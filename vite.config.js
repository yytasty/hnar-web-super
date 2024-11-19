import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { VueRouterAutoImports } from "unplugin-vue-router"
import VueRouter from "unplugin-vue-router/vite"
import { defineConfig } from "vite"
import VitePluginHtmlEnv from "vite-plugin-html-env"
import Layouts from "vite-plugin-vue-layouts"
import VueSetupExtend from "vite-plugin-vue-setup-extend"
import path from 'path';

process.env.VITE_version = require("./package.json").version

console.log(">>>>>>> process.env.buildVersion", process.env.buildVersion)

export default defineConfig({
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 23505,
  },
  plugins: [
    VitePluginHtmlEnv({
      compiler: true,
    }),
    VueRouter({
      routesFolder: [
        {
          src: "src/page",
        },
      ],
      dts: "types/router.d.ts",
      extensions: [".vue"],
      exclude: ["**/component/*", "**/__*/*"],
    }),
    Layouts({
      layoutsDirs: "src/layout",
      pagesDir: "src/page",
    }),
    vue(),
    VueSetupExtend(),
    AutoImport({
      dts: "types/auto-import.d.ts",
      imports: [
        "vue",
        "vue-router",
        VueRouterAutoImports,
        {
          "@/plugin/axios": [["default", "fetch"]],
        },
      ],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: "types/components.d.ts",
      resolvers: [ElementPlusResolver()],
    }),
  ],
  optimizeDeps: {
    include: ["schart.js"],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "~": "/src/assets",
    },
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
  },
})

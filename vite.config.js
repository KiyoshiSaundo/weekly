import { fileURLToPath, URL } from "url";

import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/weekly/",
    build: {
        outDir: "./docs",
    },
    plugins: [
        vue(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
            symbolId: "icon-[dir]-[name]",
            customDomId: "__svg__icons__dom__",
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @import "@/assets/scss/_vars.scss";
                    @import "@/assets/scss/_functions.scss";
                    @import "@/assets/scss/_mixins.scss";
                `,
            },
        },
    },
});

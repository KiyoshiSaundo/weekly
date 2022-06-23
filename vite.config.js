import {fileURLToPath, URL} from 'url';

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/weekly/',
    build: {
        outDir: './docs',
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @import "@/assets/scss/_vars.scss";
                    @import "@/assets/scss/base.scss";
                    @import "@/assets/scss/common.scss";
                `,
            },
        },
    },
});

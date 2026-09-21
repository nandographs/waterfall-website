import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      // React e motion mudam pouco: em chunks próprios eles continuam em cache
      // quando o código do site é atualizado.
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) return 'react';
            if (/[\/]node_modules[\/](motion|framer-motion|motion-dom|motion-utils)[\/]/.test(id)) return 'motion';
            return undefined;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      // Pastas que não são código-fonte: não precisam disparar reload.
      watch: {
        ignored: ['**/dist/**', '**/dist-bionlife/**', '**/assets-originais/**', '**/docs/**'],
      },
    },
  };
});

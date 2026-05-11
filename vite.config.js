import { defineConfig } from 'vite';
import path from 'path';

// Build simples: só o SCSS → style.css
// O JS é compilado separadamente via rollup (veja package.json)
export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        style: path.resolve(__dirname, 'src/scss/main.scss'),
      },
      output: {
        assetFileNames: '[name].[ext]',
      },
    },
  },
});

import path from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: path.basename(__dirname),
      fileName: (format) => `index.${format}.js`,
    },
    sourcemap: false,
    emptyOutDir: true,
  },
  plugins: [
    dts({
      exclude: ['**/*.test.ts'],
      tsConfigFilePath: 'tsconfig.production.json',
    }),
  ],
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, './src'),
    },
  },
});

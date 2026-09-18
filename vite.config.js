import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        cartas: resolve(import.meta.dirname, 'cartas.html'),
        veiculos: resolve(import.meta.dirname, 'veiculos.html'),
        funcionamento: resolve(import.meta.dirname, 'como-funciona.html'),
        sobre: resolve(import.meta.dirname, 'sobre.html'),
        contato: resolve(import.meta.dirname, 'contato.html')
      }
    }
  }
});

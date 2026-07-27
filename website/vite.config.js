import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        contact: resolve(root, 'contact.html'),
        process: resolve(root, 'process.html'),
        hyperhedge: resolve(root, 'hyperhedge.html'),
        workload: resolve(root, 'workload.html'),
        'device-context': resolve(root, 'device-context.html'),
        'identity-verification': resolve(root, 'identity-verification.html'),
        integrations: resolve(root, 'integrations.html'),
        'smart-routing': resolve(root, 'smart-routing.html'),
        'audit-trail': resolve(root, 'audit-trail.html'),
        insights: resolve(root, 'insights.html'),
      },
    },
  },
});

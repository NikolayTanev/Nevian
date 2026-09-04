import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

const documentationRoutes = [
  'onboard-first-device',
  'deployment-checklist',
  'devices',
  'agent-architecture',
  'automations',
  'identity-and-access',
  'audit-trail',
  'api-overview',
  'authentication',
  'webhooks',
  'rate-limits',
  'troubleshooting',
  'security',
  'agent-releases',
];

const documentationInputs = Object.fromEntries(
  documentationRoutes.map((route) => [
    `documentation-${route}`,
    resolve(root, `documentation/${route}/index.html`),
  ]),
);

function documentationRedirectPlugin() {
  const redirectBareDocumentationPath = (req, res, next) => {
    const url = new URL(req.url ?? '/', 'http://localhost');

    if (url.pathname !== '/documentation') {
      next();
      return;
    }

    res.statusCode = 308;
    res.setHeader('Location', `/documentation/${url.search}`);
    res.end();
  };

  return {
    name: 'documentation-trailing-slash-redirect',
    configureServer(server) {
      server.middlewares.use(redirectBareDocumentationPath);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirectBareDocumentationPath);
    },
  };
}

export default defineConfig({
  plugins: [react(), documentationRedirectPlugin()],
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
        security: resolve(root, 'security.html'),
        documentation: resolve(root, 'documentation/index.html'),
        ...documentationInputs,
        'human-handoff': resolve(root, 'human-handoff.html'),
      },
    },
  },
});

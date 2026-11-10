import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

// true replaces the whole site (local dev and the deployed build) with coming-soon.html. Set to false to bring the full site back.
const comingSoon = false;

const documentationRoutes = [
  'onboard-first-device',
  'deployment-checklist',
  'devices',
  'patching',
  'agent-architecture',
  'automations',
  'identity-and-access',
  'ai-spend-and-budget',
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

// Serves coming-soon.html as the homepage and as 404.html, so every path on GitHub Pages lands on it.
function comingSoonPlugin() {
  return {
    name: 'coming-soon',
    enforce: 'post',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const { pathname } = new URL(req.url ?? '/', 'http://localhost');
        const isPage = req.headers.accept?.includes('text/html') && (pathname.endsWith('/') || pathname.endsWith('.html') || !pathname.includes('.'));
        if (isPage) req.url = '/coming-soon.html';
        next();
      });
    },
    generateBundle(_, bundle) {
      const page = bundle['coming-soon.html'];
      delete bundle['coming-soon.html'];
      for (const fileName of ['index.html', '404.html']) {
        this.emitFile({ type: 'asset', fileName, source: page.source });
      }
    },
  };
}

const siteInputs = {
  main: resolve(root, 'index.html'),
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
  survey: resolve(root, 'survey.html'),
};

export default defineConfig({
  plugins: [react(), documentationRedirectPlugin(), comingSoon && comingSoonPlugin()],
  build: {
    rollupOptions: {
      input: comingSoon ? { 'coming-soon': resolve(root, 'coming-soon.html') } : siteInputs,
    },
  },
});

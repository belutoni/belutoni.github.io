# belux0.dev

Antonie-Gabriel Belu’s personal website. The site uses static HTML, CSS, and JavaScript and deploys from `site/` through GitHub Pages.

## Develop locally

Run `python3 -m http.server 8000 --directory site` from the repository root, then open http://localhost:8000.

The home page content is in `site/index.html`. The bean file watcher demo is in `site/assets/bean-trace.js`. The notes index and existing article live under `site/blog/`.

Pushing to the default branch deploys the site. The custom domain is declared in `site/CNAME`.

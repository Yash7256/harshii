import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createServer } from 'vite'

const root = process.cwd()
const outputDir = resolve(root, 'dist')
const routes = [
  {
    path: '/',
    title: 'Harshita Upadhyay | Product & UI/UX Designer, India',
    description: 'Harshita Upadhyay is a product and UI/UX designer in India crafting SaaS dashboards, mobile apps and design systems. View case studies and get in touch.',
    robots: 'index,follow',
  },
  {
    path: '/contact',
    title: 'Contact Harshita Upadhyay — Product Designer',
    description: 'Get in touch with Harshita Upadhyay about product design, UI/UX design, or a new project.',
    robots: 'noindex,follow',
  },
]

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

const vite = await createServer({
  configFile: resolve(root, 'vite.config.ts'),
  mode: 'production',
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
  const shell = await readFile(resolve(outputDir, 'index.html'), 'utf8')

  for (const route of routes) {
    const appHtml = renderToString(createElement(App, { initialPath: route.path }))
    const canonicalUrl = `https://www.harshitaupadhyay.site${route.path}`
    const html = shell
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      .replaceAll('__SEO_TITLE__', escapeHtml(route.title))
      .replaceAll('__SEO_DESCRIPTION__', escapeHtml(route.description))
      .replaceAll('__ROBOTS_CONTENT__', route.robots)
      .replaceAll('__CANONICAL_URL__', canonicalUrl)

    if (html.includes('__SEO_') || html.includes('__ROBOTS_CONTENT__') || html.includes('__CANONICAL_URL__')) {
      throw new Error(`SEO placeholders were not replaced for ${route.path}`)
    }
    if (!html.includes(`<div id="root">${appHtml}</div>`)) {
      throw new Error(`Could not insert prerendered app markup for ${route.path}`)
    }

    const routeDir = route.path === '/' ? outputDir : resolve(outputDir, route.path.slice(1))
    await mkdir(routeDir, { recursive: true })
    await writeFile(resolve(routeDir, 'index.html'), html)
    process.stdout.write(`Prerendered ${route.path}\n`)
  }
} finally {
  await vite.close()
}

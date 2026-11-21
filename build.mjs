import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { categories, tools as returnTools, reviewed, listingUrl } from './directory.mjs';
import { topics, additionalTools } from './shopify.mjs';

const siteName = 'Commerce Shelf';
const siteUrl = 'https://commerceshelf.com';
const positioning = 'Compare Shopify apps for returns, order tracking, preorders, invoices, and local delivery.';
const tools = [...returnTools, ...additionalTools];
const repository = 'https://github.com/feiyeiw/return-shelf';
const application = new URL(repository + '/issues/new');
application.search = new URLSearchParams({
  title: 'Featured placement application: ',
  body: 'App name:\n\nShopify App Store URL:\n\nPreferred topic:\n\nBest fit for Shopify merchants:\n\nPreferred start date:\n',
});
const stripe = process.env.STRIPE_PAYMENT_LINK?.trim();
if (stripe && !/^https:\/\/buy\.stripe\.com\/(?!test_)[A-Za-z0-9]+\/?$/.test(stripe)) {
  throw new Error('STRIPE_PAYMENT_LINK must be a live Stripe Payment Link.');
}

const escape = value => String(value).replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
);
const categoryUrl = id => `/categories/${id}/`;
const topicUrl = id => `/shopify/${id}/`;
const toolUrl = id => `/tools/${id}/`;
const topicOf = tool => tool.topic || 'returns';
const count = n => `${n} ${n === 1 ? 'tool' : 'tools'}`;
const icon = symbol => `<span class="icon icon--${symbol}" aria-hidden="true"><i></i></span>`;
const chevron = '<span class="chevron" aria-hidden="true"></span>';
const bySponsorship = (a, b) => Number(b.sponsored) - Number(a.sponsored);
const toolsForCategory = id => returnTools.filter(tool => tool.category === id).sort(bySponsorship);
const toolsForTopic = id => tools.filter(tool => topicOf(tool) === id).sort(bySponsorship);

function usd(amount) {
  return `US$${amount.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2 })}`;
}

function priceLabel(pricing, full = false) {
  if (!pricing) return '<span class="price-main">Price unknown</span>';
  const { from, to, free } = pricing;
  const freeLabel = {
    plan: 'Free plan available', install: 'Free to install', conditional: 'Free plan with conditions',
  }[free];
  const paidLabel = from === undefined ? 'Free'
    : full && to > from ? `${usd(from)}–${usd(to)}/mo`
    : full && to === from ? `${usd(from)}/mo`
    : `From ${usd(from)}/mo`;
  return `<span class="price-main">${paidLabel}</span>${freeLabel ? `<span class="price-note">${freeLabel}</span>` : ''}`;
}

const featureTags = tool => `<ul class="tags">${tool.tags.map(tag => `<li>${escape(tag)}</li>`).join('')}</ul>`;

function layout({ title, description, body, active, canonical }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} | ${siteName}</title>
  <meta name="description" content="${escape(description)}">
  ${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
  <link rel="icon" href="/assets/return-shelf.png" type="image/png">
  <link rel="stylesheet" href="/assets/directory.css?v=compare">
  <script type="module" src="/assets/subscribe.js"></script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="shell header-row">
      <a href="/" class="brand"><span class="brand-mark" aria-hidden="true"></span>${siteName}</a>
      <nav aria-label="Main navigation">
        <a href="/#directory"${active === 'directory' ? ' aria-current="true"' : ''}>Tools</a>
        <a href="/sponsor/"${active === 'sponsor' ? ' aria-current="page"' : ''}>Sponsor</a>
      </nav>
    </div>
  </header>
  <main id="main">${body}</main>
  <footer class="site-footer">
    <div class="shell footer-row">
      <span class="footer-brand">${siteName}</span>
      <span>Independent Shopify app directory</span>
      <a href="/#subscribe">Subscribe</a>
    </div>
  </footer>
</body>
</html>`;
}

function toolList(items, featureLabel) {
  return `<div class="comparison">
  <div class="comparison-labels" aria-hidden="true"><span>App</span><span>Best for</span><span>${escape(featureLabel)}</span><span>Price</span></div>
  <ul class="tool-list">${items.map(tool => `
    <li>
      <a class="tool-row" href="${toolUrl(tool.id)}">
        <div class="tool-identity">
          <span class="tool-name">${escape(tool.name)}</span>
          ${tool.sponsored ? '<span class="badge">Sponsored</span>' : ''}
        </div>
        <span class="tool-audience">${escape(tool.audience)}</span>
        <span class="tool-features">${tool.tags.map(escape).join(' · ')}</span>
        <span class="tool-price">${priceLabel(tool.pricing)}</span>
        ${chevron}
      </a>
    </li>`).join('')}</ul></div>`;
}

const topicCards = Object.entries(topics).map(([id, topic]) => `
  <a class="category-card" href="${topicUrl(id)}">
    <span class="category-top">${icon(topic.symbol)}${chevron}</span>
    <span class="category-title">${escape(topic.title)}</span>
    <span class="category-description">${escape(topic.task)}</span>
    <span class="category-count">${count(toolsForTopic(id).length)}</span>
  </a>`).join('');

function topicNavigation(activeId) {
  return `<nav class="topic-nav" aria-label="Shopify topics">${Object.entries(topics).map(([id, topic]) =>
    `<a href="${topicUrl(id)}"${activeId === id ? ' aria-current="page"' : ''}>${escape(topic.navLabel)}</a>`,
  ).join('')}</nav>`;
}

const returnGroups = Object.entries(categories).map(([id, category]) => `
  <section class="tool-group">
    <div class="group-heading">
      ${icon(category.symbol)}
      <h3><a href="${categoryUrl(id)}">${escape(category.title)}</a></h3>
    </div>
    ${toolList(toolsForCategory(id), topics.returns.featureLabel)}
  </section>`).join('');

const newsletter = `
  <section class="subscribe" id="subscribe" aria-labelledby="subscribe-title">
    <div>
      <h2 id="subscribe-title">New tools in your inbox</h2>
      <p>Get occasional updates when we add Shopify tools to the directory.</p>
    </div>
    <form action="/api/subscribe" method="post" data-subscribe>
      <label for="email">Email address</label>
      <div class="form-row">
        <input id="email" type="email" name="email" autocomplete="email" maxlength="254" required placeholder="you@yourstore.com">
        <button class="button" type="submit">Subscribe</button>
      </div>
      <p class="form-note">By subscribing, you agree to receive Commerce Shelf updates. Unsubscribe anytime.</p>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </section>`;

async function page(path, options) {
  const output = new URL(path, buildDirectory);
  const canonical = path === '404.html' ? null : `${siteUrl}/${path.replace(/index\.html$/, '')}`;
  if (canonical) sitemap.push(canonical);
  await mkdir(new URL('./', output), { recursive: true });
  await writeFile(output, layout({ ...options, canonical }));
}

const sitemap = [];
const buildDirectory = new URL('./dist/', import.meta.url);
await rm(buildDirectory, { recursive: true, force: true });
await mkdir(buildDirectory, { recursive: true });
await cp(new URL('./assets/', import.meta.url), new URL('./assets/', buildDirectory), { recursive: true });

await page('index.html', {
  title: 'Shopify app directory by task',
  description: positioning,
  active: 'directory',
  body: `<div class="shell home">
    <div class="home-directory">
      <div class="hero-copy">
        <h1>Shopify apps for<br> store operations.</h1>
        <p class="lede">Compare apps, features, and pricing for everyday Shopify tasks.</p>
      </div>
      <section id="directory" aria-labelledby="directory-title">
        <div class="section-head"><h2 id="directory-title">Browse by task</h2><p>${count(tools.length)} across ${Object.keys(topics).length} topics</p></div>
        <div class="category-grid topic-grid" id="tools">${topicCards}</div>
      </section>
      <img class="hero-image" src="/assets/return-mailer.webp" alt="" decoding="async" width="1200" height="961">
    </div>
    ${newsletter}
  </div>`,
});

for (const [id, topic] of Object.entries(topics)) {
  const items = toolsForTopic(id);
  await page(`shopify/${id}/index.html`, {
    title: `Shopify ${topic.title.toLowerCase()} tools`,
    description: topic.description,
    active: 'directory',
    body: `<div class="shell inner topic-page">
      <a class="crumb" href="/#directory">${chevron} All topics</a>
      <header class="inner-heading">
        <h1>${escape(topic.title)}</h1>
        <p class="lede">${escape(topic.description)}</p>
        ${icon(topic.symbol)}
      </header>
      ${topicNavigation(id)}
      <div class="section-head listing-head"><h2>${count(items.length)} to compare</h2><p>Published prices in USD</p></div>
      ${id === 'returns' ? returnGroups : toolList(items, topic.featureLabel)}
    </div>`,
  });
}

for (const [id, category] of Object.entries(categories)) {
  const items = toolsForCategory(id);
  await page(`categories/${id}/index.html`, {
    title: `Shopify ${category.title.toLowerCase()}`,
    description: category.description,
    active: 'directory',
    body: `<div class="shell inner topic-page">
      <a class="crumb" href="${topicUrl('returns')}">${chevron} Returns &amp; exchanges</a>
      <header class="inner-heading">
        <h1>${escape(category.title)}</h1>
        <p class="lede">${escape(category.description)}</p>
        ${icon(category.symbol)}
      </header>
      <div class="section-head listing-head"><h2>${count(items.length)}</h2><p>Listed prices in USD</p></div>
      ${toolList(items, topics.returns.featureLabel)}
    </div>`,
  });
}

for (const tool of tools) {
  const topicId = topicOf(tool);
  const topic = topics[topicId];
  const category = categories[tool.category];
  const parent = category || topic;
  const parentUrl = category ? categoryUrl(tool.category) : topicUrl(topicId);
  await page(`tools/${tool.id}/index.html`, {
    title: `${tool.name} for Shopify`,
    description: tool.summary,
    active: 'directory',
    body: `<article class="shell inner tool-page">
      <a class="crumb" href="${parentUrl}">${chevron} ${escape(parent.title)}</a>
      <header class="inner-heading">
        <h1>${escape(tool.name)}</h1>
        <p class="lede">${escape(tool.summary)}</p>
        ${icon(parent.symbol)}
      </header>
      <section class="profile-grid tool-profile" aria-label="Tool details">
        <dl class="details">
          <div><dt>Best for</dt><dd>${escape(tool.audience)}</dd></div>
          <div><dt>Key features</dt><dd>${featureTags(tool)}</dd></div>
          <div><dt>Listed price</dt><dd class="tool-profile-price">${priceLabel(tool.pricing, true)}${tool.pricing?.note ? `<p class="source-note">${escape(tool.pricing.note)}</p>` : ''}</dd></div>
          <div><dt>Sponsored</dt><dd>${tool.sponsored ? 'Yes' : 'No'}</dd></div>
        </dl>
        <div class="action-panel">
          <a class="button" href="${escape(tool.website)}">Official website</a>
          <a class="text-link" href="${escape(listingUrl(tool))}">Shopify App Store source</a>
          <p class="source-note">Pricing checked <time datetime="${reviewed}">November 21, 2026</time>. Usage and carrier fees may apply.</p>
        </div>
      </section>
    </article>`,
  });
}

await page('sponsor/index.html', {
  title: 'Sponsor the directory',
  description: 'Apply for a labeled featured spot in the Commerce Shelf Shopify app directory.',
  active: 'sponsor',
  body: `<div class="shell inner sponsor">
    <header class="inner-heading">
      <h1>Reach merchants choosing a Shopify app.</h1>
      <p class="lede">Request a featured spot on the topic page that best fits your app.</p>
    </header>
    <div class="profile-grid">
      <dl class="details">
        <div><dt>Placement</dt><dd>Your app appears at the top of a relevant topic list. On the returns topic, it appears at the top of the relevant subcategory.</dd></div>
        <div><dt>Duration</dt><dd>Request a 30-day placement. We confirm the start date and pricing after review.</dd></div>
        <div><dt>Disclosure</dt><dd>Featured listings carry a Sponsored label in the directory and on the tool page.</dd></div>
        <div><dt>Eligibility</dt><dd>Live Shopify apps that fit one of the directory’s current topics.</dd></div>
      </dl>
      <div class="action-panel">
        <h2>Application details</h2>
        <p>Include your app name, Shopify App Store URL, preferred topic, the merchants you serve, and your preferred start date.</p>
        <a class="button" href="${escape(stripe || application.href)}">${stripe ? 'Pay with Stripe' : 'Apply for placement'}</a>
        ${stripe ? '' : '<p>Applications are public on GitHub.</p>'}
      </div>
    </div>
  </div>`,
});

await page('404.html', {
  title: 'Page not found',
  description: 'Find Shopify apps for your store in the Commerce Shelf directory.',
  body: '<div class="shell inner"><h1>Page not found</h1><p><a href="/#directory">Browse the directory</a></p></div>',
});

await writeFile(new URL('sitemap.xml', buildDirectory), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(new URL('robots.txt', buildDirectory), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

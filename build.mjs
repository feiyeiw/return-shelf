import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { categories, tools as returnTools, reviewed, listingUrl } from './directory.mjs';
import { topics, additionalTools } from './shopify.mjs';
import { homeQuestions, topicQuestions, returnCategoryQuestions, toolQuestions, sponsorQuestions } from './faq.mjs';
import { topicGuides } from './guides.mjs';
import { articles } from './articles.mjs';
import { serviceRequestUrl, services } from './services.mjs';

const siteName = 'Commerce Shelf';
const siteUrl = 'https://commerceshelf.com';
const siteImage = `${siteUrl}/assets/return-mailer.webp`;
const indexNowKey = 'e146404062026c593e3ebf2989bb9a21';
const positioning = 'Compare Shopify apps for returns, order tracking, preorders, invoices, and local delivery.';
const tools = [...returnTools, ...additionalTools];
const toolsById = new Map(tools.map(tool => [tool.id, tool]));
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
const articleUrl = article => `/guides/${article.slug}/`;
const serviceUrl = service => `/services/${service.slug}/`;
const topicOf = tool => tool.topic || 'returns';
const count = n => `${n} ${n === 1 ? 'tool' : 'tools'}`;
const icon = symbol => `<span class="icon icon--${symbol}" aria-hidden="true"><i></i></span>`;
const chevron = '<span class="chevron" aria-hidden="true"></span>';
const bySponsorship = (a, b) => Number(b.sponsored) - Number(a.sponsored);
const toolsForCategory = id => returnTools.filter(tool => tool.category === id).sort(bySponsorship);
const toolsForTopic = id => tools.filter(tool => topicOf(tool) === id).sort(bySponsorship);
const homeTrail = [['Home', '/']];
const topicTrail = id => [...homeTrail, [topics[id].title, topicUrl(id)]];
const categoryTrail = id => [...topicTrail('returns'), [categories[id].title, categoryUrl(id)]];

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

function pricingAnswer(tool) {
  if (!tool.pricing) return 'Public pricing is unknown. Check the Shopify App Store listing or ask the vendor for current terms.';
  const { free, from, to, note } = tool.pricing;
  if (free === 'only') return note || `The Shopify App Store lists ${tool.name} as free. Check the listing for current terms.`;
  const paid = to > from ? `range from ${usd(from)} to ${usd(to)} per month`
    : to === from ? `cost ${usd(from)} per month`
    : `start at ${usd(from)} per month`;
  const freeTerms = {
    plan: 'The listing also shows a free plan with its own limits.',
    install: 'It is free to install. Paid features or usage charges can still apply.',
    conditional: 'The listing also shows a free option with eligibility or funding conditions.',
  }[free];
  return `Published paid plans for ${tool.name} ${paid}. ${note || freeTerms || 'Check the app listing for current fees and plan limits.'}`;
}

function questions(title, entries) {
  return `<section class="faq" id="faq" aria-labelledby="faq-heading">
    <h2 id="faq-heading">${escape(title)}</h2>
    <div class="faq-list">${entries.map(([question, answer, source]) => {
      const id = question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<article class="faq-answer" id="faq-${id}">
        <h3>${escape(question)}</h3>
        <p>${escape(answer)}</p>
        ${source ? `<p class="faq-source"><a class="text-link" href="${escape(source[1])}">${escape(source[0])}</a></p>` : ''}
      </article>`;
    }).join('')}</div>
  </section>`;
}

function breadcrumbs(trail) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${trail.map(([name, path], index) =>
    index === trail.length - 1 ? `<li aria-current="page">${escape(name)}</li>`
      : `<li><a href="${escape(path)}">${escape(name)}</a></li>`,
  ).join('')}</ol></nav>`;
}

function structuredData({ title, description, canonical, list, listAnchor = 'compare', trail, published }) {
  if (!canonical) return '';
  const publisher = {
    '@type': 'Organization', '@id': `${siteUrl}/#publisher`, name: siteName,
    url: `${siteUrl}/`, logo: `${siteUrl}/assets/return-shelf.png`,
  };
  const website = {
    '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: siteName,
    url: `${siteUrl}/`, publisher: { '@id': publisher['@id'] },
  };
  const webPage = {
    '@type': list ? 'CollectionPage' : canonical.endsWith('/methodology/') ? 'AboutPage' : 'WebPage', '@id': canonical, url: canonical,
    name: title, description, inLanguage: 'en', isPartOf: { '@id': website['@id'] },
    publisher: { '@id': publisher['@id'] },
  };
  const graph = [publisher, website, webPage];
  const listItems = entries => entries.map(([name, path], index) => ({ '@type': 'ListItem', position: index + 1, name, item: new URL(path, siteUrl).href }));
  if (trail) {
    const breadcrumbId = `${canonical}#breadcrumb`;
    webPage.breadcrumb = { '@id': breadcrumbId };
    graph.push({ '@type': 'BreadcrumbList', '@id': breadcrumbId, itemListElement: listItems(trail) });
  }
  if (list) {
    const listId = `${canonical}#${listAnchor}`;
    webPage.mainEntity = { '@id': listId };
    graph.push({ '@type': 'ItemList', '@id': listId, numberOfItems: list.length, itemListElement: listItems(list) });
  }
  if (published) {
    const articleId = `${canonical}#article`;
    webPage.mainEntity = { '@id': articleId };
    graph.push({
      '@type': 'Article', '@id': articleId, headline: title, description, inLanguage: 'en',
      datePublished: published, mainEntityOfPage: { '@id': canonical },
      author: { '@id': publisher['@id'] }, publisher: { '@id': publisher['@id'] },
    });
  }
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

const toolListEntries = items => items.map(tool => [tool.name, toolUrl(tool.id)]);

function layout({ title, description, body, active, canonical, list, listAnchor, trail, published }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} | ${siteName}</title>
  <meta name="description" content="${escape(description)}">
  ${canonical ? `<link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${published ? 'article' : 'website'}">
  <meta property="og:site_name" content="${siteName}">
  <meta property="og:title" content="${escape(title)} | ${siteName}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteImage}">
  <meta property="og:image:alt" content="An open blue shipping box with a return label">
  <meta name="twitter:card" content="summary_large_image">` : ''}
  ${structuredData({ title, description, canonical, list, listAnchor, trail, published })}
  <link rel="icon" href="/assets/return-shelf.png" type="image/png">
  <link rel="stylesheet" href="/assets/directory.css?v=setup-handoff">
  <script type="module" src="/assets/subscribe.js"></script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="shell header-row">
      <a href="/" class="brand"><span class="brand-mark" aria-hidden="true"></span>${siteName}</a>
      <nav aria-label="Main navigation">
        <a href="/#directory"${active === 'directory' ? ' aria-current="true"' : ''}>Tools</a>
        <a href="/blog/"${active === 'blog' ? ' aria-current="page"' : published ? ' aria-current="true"' : ''}>Blog</a>
        <a href="/sponsor/"${active === 'sponsor' ? ' aria-current="page"' : ''}>Sponsor</a>
      </nav>
    </div>
  </header>
  <main id="main">${body}</main>
  <footer class="site-footer">
    <div class="shell footer-row">
      <span class="footer-brand">${siteName}</span>
      <span>Independent Shopify app directory</span>
      <a href="/methodology/">How we compare apps</a>
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

function buyingGuide(guide, article) {
  return `<section class="buying-guide" id="guide" aria-labelledby="guide-heading">
    <h2 id="guide-heading">How to choose</h2>
    <p class="guide-summary">${escape(guide.summary)}</p>
    <ul class="guide-examples">${guide.examples.map(([task, id, advice]) => {
      const tool = toolsById.get(id);
      return `<li>
        <h3>${escape(task)}</h3>
        <p>${escape(advice)}</p>
        <a class="text-link" href="${toolUrl(id)}">${escape(tool.name)}</a>
      </li>`;
    }).join('')}</ul>
    <div class="guide-check"><h3>Before you install</h3><p>${escape(guide.check)}</p></div>
    ${article ? `<p class="guide-summary"><a class="text-link" href="${articleUrl(article)}">${escape(article.title)}</a></p>` : ''}
    <a class="text-link guide-method" href="/methodology/">How Commerce Shelf compares apps</a>
  </section>`;
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
  list: Object.entries(topics).map(([id, topic]) => [topic.title, topicUrl(id)]),
  listAnchor: 'directory',
  body: `<div class="shell home">
    <div class="home-directory">
      <div class="hero-copy">
        <h1>Shopify apps for<br> store operations.</h1>
        <p class="lede">Compare apps, features, and pricing for everyday Shopify tasks.</p>
      </div>
      <section id="directory" aria-labelledby="directory-title">
        <div class="section-head"><h2 id="directory-title">Browse by task</h2><p class="section-meta">${count(tools.length)} across ${Object.keys(topics).length} topics <a class="text-link" href="#faq">FAQ</a></p></div>
        <div class="category-grid topic-grid" id="tools">${topicCards}</div>
      </section>
      <img class="hero-image" src="/assets/return-mailer.webp" alt="" decoding="async" width="1200" height="961">
    </div>
    ${questions('Questions about Commerce Shelf', homeQuestions)}
    ${newsletter}
  </div>`,
});

for (const [id, topic] of Object.entries(topics)) {
  const items = toolsForTopic(id);
  const guide = topicGuides[id];
  const service = services[id];
  await page(`shopify/${id}/index.html`, {
    title: guide.title,
    description: guide.description,
    active: 'directory',
    trail: topicTrail(id),
    list: toolListEntries(id === 'returns' ? Object.keys(categories).flatMap(toolsForCategory) : items),
    body: `<div class="shell inner topic-page">
      ${breadcrumbs(topicTrail(id))}
      <header class="inner-heading">
        <h1>${escape(topic.title)}</h1>
        <p class="lede">${escape(topic.description)}</p>
        ${icon(topic.symbol)}
      </header>
      ${topicNavigation(id)}
      ${service ? `<section class="service-offer" aria-labelledby="service-offer-title">
        <div>
          <p class="service-provider">Setup by Commerce Shelf</p>
          <h2 id="service-offer-title">${escape(service.title)}</h2>
          <p class="service-summary">${escape(service.summary)}</p>
          ${service.pilotPrice ? `<p class="service-price"><strong>${usd(service.pilotPrice)}</strong> one-time pilot price${id === 'tracking' ? ' · app subscription separate' : ''}</p>` : ''}
        </div>
        <a class="button" href="${serviceUrl(service)}">${service.workflow ? 'See what you get' : 'Request setup'}</a>
      </section>` : ''}
      <div class="section-head listing-head" id="compare"><h2>${count(items.length)} to compare</h2><p class="section-meta"><a class="text-link" href="#guide">Buying guide</a><a class="text-link" href="#faq">FAQ</a></p></div>
      ${id === 'returns' ? returnGroups : toolList(items, topic.featureLabel)}
      ${buyingGuide(guide, articles[id])}
      ${questions('Common questions', topicQuestions[id])}
    </div>`,
  });
}

for (const [topicId, service] of Object.entries(services)) {
  const trail = [...topicTrail(topicId), [service.title, serviceUrl(service)]];
  await page(`services/${service.slug}/index.html`, {
    title: service.title,
    description: service.summary,
    trail,
    body: `<div class="shell inner service-page">
      ${breadcrumbs(trail)}
      <header class="inner-heading">
        <h1>${escape(service.title)}</h1>
        <p class="lede">${escape(service.summary)}</p>
        ${service.pilotPrice ? `<p class="service-price"><strong>${usd(service.pilotPrice)}</strong> one-time pilot price · app subscription separate</p>` : ''}
      </header>
      <div class="sponsor-information">
        <section aria-labelledby="service-details">
          <h2 id="service-details">${service.workflow ? 'What you get' : 'What we set up'}</h2>
          <ul>${service.deliverables.map(item => `<li>${escape(item)}</li>`).join('')}</ul>
          <p>${escape(service.scope)}</p>
          ${service.workflow ? `<h2 class="service-workflow-heading">How it works</h2>
          <ol>${service.workflow.map(step => `<li>${escape(step)}</li>`).join('')}</ol>` : ''}
          <a class="text-link" href="${articleUrl(articles[topicId])}">${service.workflow ? 'Set it up yourself with the free guide' : 'Read the setup guide'}</a>
        </section>
        <section class="application-panel service-request" aria-labelledby="quote-title">
          <h2 id="quote-title">${service.pilotPrice ? 'Request setup' : 'Request a quote'}</h2>
          <p>Share your store link, email, and what you want set up. ${service.pilotPrice ? 'We’ll confirm compatibility and any app fees before starting.' : 'We’ll reply with the scope and price.'}</p>
          <a class="button" href="${escape(serviceRequestUrl)}">${service.workflow ? 'Send your store details' : 'Open the request form'}</a>
        </section>
      </div>
    </div>`,
  });
}

const articleDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });
const blogArticles = Object.entries(articles).sort(([, a], [, b]) => b.published.localeCompare(a.published));
const blogTrail = [...homeTrail, ['Blog', '/blog/']];
await page('blog/index.html', {
  title: 'Shopify Operations Blog',
  description: 'Practical Shopify guides for setting up order tracking, printing packing slips, and running everyday store operations.',
  active: 'blog',
  trail: blogTrail,
  list: blogArticles.map(([, article]) => [article.title, articleUrl(article)]),
  listAnchor: 'articles',
  body: `<div class="shell inner blog">
    ${breadcrumbs(blogTrail)}
    <header class="inner-heading">
      <h1>Shopify operations blog</h1>
      <p class="lede">Step-by-step guides for running your Shopify store.</p>
    </header>
    <ul class="blog-articles" id="articles">${blogArticles.map(([topicId, article]) => `<li>
      <a class="blog-article" href="${articleUrl(article)}" aria-labelledby="${article.slug}">
        ${icon(topics[topicId].symbol)}
        <div>
          <p class="blog-topic">${escape(topics[topicId].title)}</p>
          <h2 id="${article.slug}">${escape(article.title)}</h2>
          <p class="blog-description">${escape(article.description)}</p>
        </div>
        <time datetime="${article.published}">${articleDate.format(new Date(article.published))}</time>
        ${chevron}
      </a>
    </li>`).join('')}</ul>
  </div>`,
});

for (const [topicId, article] of blogArticles) {
  const trail = [...topicTrail(topicId), [article.title, articleUrl(article)]];
  await page(`guides/${article.slug}/index.html`, {
    title: article.title,
    description: article.description,
    published: article.published,
    trail,
    body: `<article class="shell inner article-page" id="article">
      ${breadcrumbs(trail)}
      <header class="inner-heading">
        <h1>${escape(article.title)}</h1>
        <p class="lede">${escape(article.intro)}</p>
        <p class="article-byline">${siteName} <span aria-hidden="true">·</span> <time datetime="${article.published}">${articleDate.format(new Date(article.published))}</time></p>
      </header>
      <div class="article-layout">
        <nav class="article-index" aria-label="On this page">
          <p>On this page</p>
          <ol>${article.sections.map(({ id, title }) => `<li><a class="text-link" href="#${id}">${escape(title)}</a></li>`).join('')}</ol>
        </nav>
        <div class="article-content">
          ${article.sections.map(({ id, title, body }) => `<section id="${id}">
            <h2>${escape(title)}</h2>
            ${body}
          </section>`).join('')}
          <section class="article-related" aria-labelledby="article-related-title">
            <h2 id="article-related-title">Apps in the directory</h2>
            <ul>${article.tools.map(id => `<li><a class="text-link" href="${toolUrl(id)}">${escape(toolsById.get(id).name)}</a></li>`).join('')}</ul>
            <a class="button" href="${topicUrl(topicId)}">${escape(article.compareLabel)}</a>
            ${services[topicId] ? `<p class="service-guide-link"><a class="text-link" href="${serviceUrl(services[topicId])}">Get setup help from Commerce Shelf</a></p>` : ''}
          </section>
        </div>
      </div>
    </article>`,
  });
}

for (const [id, category] of Object.entries(categories)) {
  const items = toolsForCategory(id);
  await page(`categories/${id}/index.html`, {
    title: `Shopify ${category.title.toLowerCase()}`,
    description: category.description,
    active: 'directory',
    trail: categoryTrail(id),
    list: toolListEntries(items),
    body: `<div class="shell inner topic-page">
      ${breadcrumbs(categoryTrail(id))}
      <header class="inner-heading">
        <h1>${escape(category.title)}</h1>
        <p class="lede">${escape(category.description)}</p>
        ${icon(category.symbol)}
      </header>
      <div class="section-head listing-head" id="compare"><h2>${count(items.length)} to compare</h2><a class="text-link" href="#faq">Common questions</a></div>
      ${toolList(items, topics.returns.featureLabel)}
      ${questions('Common questions', returnCategoryQuestions[id])}
    </div>`,
  });
}

for (const tool of tools) {
  const topicId = topicOf(tool);
  const topic = topics[topicId];
  const category = categories[tool.category];
  const parent = category || topic;
  const parentUrl = category ? categoryUrl(tool.category) : topicUrl(topicId);
  const peers = category ? toolsForCategory(tool.category) : toolsForTopic(topicId);
  const related = peers.filter(peer => peer.id !== tool.id).slice(0, 3);
  const trail = [...(category ? categoryTrail(tool.category) : topicTrail(topicId)), [tool.name, toolUrl(tool.id)]];
  const source = [`${tool.name} on the Shopify App Store`, listingUrl(tool)];
  const specific = toolQuestions[tool.id];
  const appQuestions = [
    ...(specific ? [[...specific, source]] : []),
    [`How much does ${tool.name} cost?`, pricingAnswer(tool), source],
  ];
  await page(`tools/${tool.id}/index.html`, {
    title: `${tool.name} for Shopify`,
    description: tool.summary,
    active: 'directory',
    trail,
    body: `<article class="shell inner tool-page">
      ${breadcrumbs(trail)}
      <div class="tool-overview">
        <header class="tool-heading">
          <div class="tool-mark">${icon(parent.symbol)}${tool.sponsored ? '<span class="badge">Sponsored</span>' : ''}</div>
          <h1>${escape(tool.name)}</h1>
          <p class="lede">${escape(tool.summary)}</p>
          <a class="text-link app-questions-link" href="#faq">App questions</a>
        </header>
        <section class="tool-links" aria-labelledby="price-heading">
          <div class="tool-pricing">
            <h2 id="price-heading">Listed price</h2>
            <div class="tool-profile-price">${priceLabel(tool.pricing, true)}</div>
            ${tool.pricing?.note ? `<p class="source-note">${escape(tool.pricing.note)}</p>` : ''}
          </div>
          <div class="tool-actions">
            <a class="button" href="${escape(tool.website)}">Visit official website</a>
            <a class="text-link" href="${escape(listingUrl(tool))}">Shopify App Store listing</a>
            <p class="source-note">Pricing checked <time datetime="${reviewed}">November 21, 2026</time>. Usage and carrier fees may apply.</p>
          </div>
        </section>
        <dl class="details tool-facts">
          <div><dt>Best for</dt><dd>${escape(tool.audience)}</dd></div>
          <div><dt>Key features</dt><dd>${featureTags(tool)}</dd></div>
          <div><dt>Sponsored</dt><dd>${tool.sponsored ? 'Yes' : 'No'}</dd></div>
        </dl>
      </div>
      ${related.length ? `<section class="related" aria-labelledby="related-heading">
        <div class="section-head">
          <h2 id="related-heading">Compare related apps</h2>
          <a class="text-link" href="${parentUrl}">View all ${escape(parent.title.toLowerCase())} tools</a>
        </div>
        <ul class="related-tools">${related.map(peer => `<li><a class="related-tool" href="${toolUrl(peer.id)}">
          <div class="related-name"><span class="tool-name">${escape(peer.name)}</span>${peer.sponsored ? '<span class="badge">Sponsored</span>' : ''}</div>
          <div class="related-price">${priceLabel(peer.pricing)}</div>
          ${chevron}
        </a></li>`).join('')}</ul>
      </section>` : ''}
      ${questions('Questions about this app', appQuestions)}
    </article>`,
  });
}

await page('sponsor/index.html', {
  title: 'Sponsor the directory',
  description: 'Apply for a labeled featured spot in the Commerce Shelf Shopify app directory.',
  active: 'sponsor',
  trail: [...homeTrail, ['Sponsor', '/sponsor/']],
  body: `<div class="shell inner sponsor">
    ${breadcrumbs([...homeTrail, ['Sponsor', '/sponsor/']])}
    <div class="sponsor-intro">
      <header>
        <h1>Get featured on Commerce Shelf.</h1>
        <p class="lede">Request a 30-day sponsored placement where merchants compare Shopify apps for the same task.</p>
        <div class="sponsor-actions">
          <a class="button" href="${escape(stripe || application.href)}">${stripe ? 'Pay with Stripe' : 'Apply for placement'}</a>
          <a class="text-link" href="#application">See application details</a>
        </div>
      </header>
      <figure class="sponsor-preview">
        <figcaption>Example placement</figcaption>
        <div class="preview-list">
          <div class="preview-topic">${icon(topics.preorders.symbol)}<strong>${escape(topics.preorders.title)}</strong></div>
          <div class="preview-app">
            <div><strong>Your Shopify app</strong><span class="badge">Sponsored</span></div>
            <p>At the top of the topic’s comparison list.</p>
          </div>
          <p class="preview-other">Other apps in this topic</p>
        </div>
      </figure>
    </div>
    <div class="sponsor-information">
      <section aria-labelledby="placement-heading">
        <h2 id="placement-heading">Placement details</h2>
        <dl class="details">
          <div><dt>Position</dt><dd>At the top of one topic list. For returns apps, placement is at the top of the relevant subcategory.</dd></div>
          <div><dt>Term</dt><dd>30 days. We confirm availability, the start date, and pricing after review.</dd></div>
          <div><dt>Label</dt><dd>Sponsored appears on your directory listing and your app detail page.</dd></div>
          <div><dt>Eligibility</dt><dd>Live Shopify apps for <a class="text-link" href="/shopify/returns/">returns</a>, <a class="text-link" href="/shopify/preorders/">preorders and restock</a>, or <a class="text-link" href="/shopify/local-delivery/">local delivery and pickup</a>.</dd></div>
        </dl>
      </section>
      <section class="application-panel" id="application" aria-labelledby="application-heading">
        <h2 id="application-heading">What to include</h2>
        <ul>
          <li>App name and Shopify App Store URL</li>
          <li>Preferred topic and the merchants your app serves</li>
          <li>Preferred start date</li>
        </ul>
        <p class="source-note">${stripe ? `<a class="text-link" href="${escape(application.href)}">Open the public application on GitHub</a>` : 'The application is a public GitHub issue.'}</p>
        <p class="source-note"><a class="text-link" href="#faq">See sponsorship questions</a></p>
      </section>
    </div>
    ${questions('Sponsorship questions', sponsorQuestions)}
  </div>`,
});

const methodologyTrail = [...homeTrail, ['How we compare apps', '/methodology/']];
await page('methodology/index.html', {
  title: 'How We Compare Shopify Apps',
  description: 'How Commerce Shelf selects Shopify apps, checks published pricing, writes buying guides, and labels sponsored placements.',
  trail: methodologyTrail,
  body: `<article class="shell inner methodology">
    ${breadcrumbs(methodologyTrail)}
    <header>
      <h1>How we compare Shopify apps</h1>
      <p class="lede">Commerce Shelf is an independent directory organized around tasks Shopify merchants handle in their stores.</p>
    </header>
    <section>
      <h2>How apps are selected</h2>
      <p>Each app belongs to a topic based on the workflow it supports. Tool profiles link to the Shopify App Store listing and the vendor’s official site. The “Best for” field describes how the app’s published features fit a merchant’s task.</p>
    </section>
    <section>
      <h2>What the guides compare</h2>
      <p>Each buying guide pairs specific tasks with examples from the directory and gives merchants a workflow to test in their own store. The comparisons are based on public documentation. Actual results depend on the app plan, Shopify setup, and the store’s workflow.</p>
    </section>
    <section>
      <h2>How to read pricing</h2>
      <p>Prices are published in US dollars, and each app page shows when its listing was checked. Free plans, free installation, and free offers with eligibility conditions are labeled separately. Check the vendor’s listing for usage thresholds, extra fees, and plan details.</p>
    </section>
    <section>
      <h2>How sponsorship is labeled</h2>
      <p>A paid placement appears at the top of the relevant topic list or returns subcategory. It is labeled Sponsored in the list and on the app page. <a class="text-link" href="/sponsor/">Read the placement terms</a>.</p>
    </section>
    <a class="button" href="/#directory">Browse the directory</a>
  </article>`,
});

await page('404.html', {
  title: 'Page not found',
  description: 'Find Shopify apps for your store in the Commerce Shelf directory.',
  body: '<div class="shell inner"><h1>Page not found</h1><p><a href="/#directory">Browse the directory</a></p></div>',
});

await writeFile(new URL('sitemap.xml', buildDirectory), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(new URL('robots.txt', buildDirectory), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
await writeFile(new URL(`${indexNowKey}.txt`, buildDirectory), indexNowKey);

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');


function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const metaBlock = match[1];
  const body = match[2];
  const meta = {};

  for (const line of metaBlock.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();

    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(t => t.trim()).filter(Boolean);
    } else if (val === 'null') {
      val = null;
    } else if (val === 'true') {
      val = true;
    } else if (val === 'false') {
      val = false;
    }

    meta[key] = val;
  }

  return { meta, body };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function tagsToHtml(tags) {
  if (!tags || tags.length === 0) return '';
  return tags.map(t => `[${t}]`).join(' ');
}

function slugify(text) {
  return text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
}

function slugFromFile(filename) {
  return path.basename(filename, '.md');
}

function deriveExcerpt(body, maxLen) {
  maxLen = maxLen || 300;
  const text = body
    .replace(/<[^>]*>/g, '')
    .replace(/^#{1,6}\s.*$/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
    .split('\n')
    .slice(0, 4)
    .join(' ')
    .replace(/[*`_>#\[\]]/g, '')
    .trim();
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > maxLen * 0.5 ? cut.slice(0, lastSpace) : cut).trim() + '\u2026';
}

// ── heading IDs via custom renderer ──
const renderer = new marked.Renderer();
const usedIds = {};
renderer.heading = function() {
  var text, level;
  if (typeof arguments[0] === 'object' && arguments[0] !== null) {
    text = arguments[0].text || '';
    level = arguments[0].depth || 1;
  } else {
    text = String(arguments[0] || '');
    level = arguments[1] || 1;
  }
  var raw = text.replace(/<[^>]*>/g, '');
  var base = slugify(raw);
  var id = base;
  var n = 2;
  while (usedIds[id]) {
    id = base + '-' + n;
    n++;
  }
  usedIds[id] = true;
  return '<h' + level + ' id="' + id + '">' + text + '</h' + level + '>';
};
marked.use({ renderer });


function buildPostHtml({ slug, title, date, tags, series, readingTime, prev, next, fragment }) {
  const tagStr = tags && tags.length ? ` &mdash; ${tagsToHtml(tags)}` : '';
  const seriesStr = series ? `<br><small>series: ${escapeHtml(series)}</small>` : '';
  const readStr = readingTime ? ` &mdash; ${readingTime} min read` : '';

  let prevNext = '';
  if (prev || next) {
    prevNext = '<hr><small>';
    if (prev) prevNext += `<a href="${prev.slug}.html">&larr; ${escapeHtml(prev.title)}</a>`;
    if (prev && next) prevNext += ' &middot; ';
    if (next) prevNext += `<a href="${next.slug}.html">${escapeHtml(next.title)} &rarr;</a>`;
    prevNext += '</small>';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${escapeHtml(title)} - Aakarsh Kashyap</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="alternate" type="application/rss+xml" title="Aakarsh Kashyap" href="/feed.xml">
  <link rel="icon" type="image/x-icon" href="../favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../latex-theme.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<style>
a:visited { color: #0000EE; }
img { max-width: 100%; height: auto; }
center img[src*="buttons/"] { width: 88px; height: 31px; max-width: none; }
.post-content {
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}
.post-content pre {
  overflow-x: auto;
  white-space: pre;
  word-break: normal;
  word-wrap: normal;
}
.post-content code {
  word-break: break-all;
}
@media (max-width: 600px) {
  table[width="100%"] > tbody > tr { display: block; }
  table[width="100%"] > tbody > tr > td,
  table[width="100%"] > tr > td {
    display: block;
    width: 100% !important;
    border-right: none !important;
    border-left: none !important;
    border-bottom: 1px solid black;
    box-sizing: border-box;
  }
}
</style>
</head>
<body>

<div id="app">
  <weird-layout marquee="welcome to my site">
      <a href="../blog.html">&larr; back to blog</a>
      <hr>
      <b>${escapeHtml(title)}</b><br>
      <small>${date}${tagStr}${readStr}</small>${seriesStr}
      <hr>
      <!-- FRAGMENT START -->
      <div class="post-content">
${fragment}
      </div>
      <!-- FRAGMENT END -->
      <hr>
<script src="https://giscus.app/client.js"
        data-repo="souls-syntax/portfolio"
        data-repo-id="R_kgDOSnkCrw"
        data-category="General"
        data-category-id="DIC_kwDOSnkCr84DAfMP"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="dark_tritanopia"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
      <hr>
      ${prevNext}
      <small><a href="../blog.html">&larr; back to blog</a></small>
  </weird-layout>
</div>

<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="../layouts/weird-layout.js"></script>
<script>Vue.createApp({}).component('weird-layout', WeirdLayout).mount('#app');</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script>hljs.highlightAll();</script>
<nav class="latex-nav">
  <a href="../index.html">about</a> &middot;
  <a href="../resume.html">resume</a> &middot;
  <a href="../projects.html">projects</a> &middot;
  <a href="../blog.html">blog</a> &middot;
  <a href="https://github.com/souls-syntax">github</a>
</nav>
<a href="#" class="latex-chip toc-chip" id="toc-chip">\\tableofcontents</a>
<div class="latex-toc" id="latex-toc"></div>
<div class="latex-taskbar">
  <div class="taskbar-left">
    <a href="../index.html">about</a> &middot;
    <a href="../resume.html">resume</a> &middot;
    <a href="../projects.html">projects</a> &middot;
    <a href="../blog.html">blog</a> &middot;
    <a href="https://github.com/souls-syntax">github</a>
  </div>
  <div class="taskbar-center"><i>made with vim and spite</i></div>
  <div class="taskbar-right"><span id="latex-clock">--:--</span></div>
</div>
<a href="#" class="latex-chip top-chip" id="top-chip">\\top</a>
<a href="#" class="latex-chip pagecolor-chip" id="pagecolor-chip">\\pagecolor{dark}</a>
<a href="#" class="latex-chip" id="theme-chip">\\end{document}</a>
<script src="../js/theme-toggle.js"></script>
</body>
</html>`;
}


const postsDir = path.join(__dirname, '../../posts');
const postsJson = path.join(__dirname, '../../posts.json');

const mdFiles = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');

const index = [];

for (const file of mdFiles) {
  const slug = slugFromFile(file);
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const { meta, body } = parseFrontmatter(raw);

  const title = meta.title || slug;
  const date = meta.date || '';
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  const series = meta.series || null;

  // draft support: skip drafts entirely
  if (meta.draft === true || meta.draft === 'true') {
    console.log(`skipped draft: posts/${slug}.html`);
    continue;
  }

  // reading time: word count / 200, min 1
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  // excerpt: explicit frontmatter or auto-derived
  const excerpt = (meta.excerpt && String(meta.excerpt)) || deriveExcerpt(body);

  index.push({ slug, title, date, tags, series, readingTime, excerpt, url: `posts/${slug}.html` });
}

// sort newest first (stable)
index.sort((a, b) => {
  if (b.date > a.date) return 1;
  if (b.date < a.date) return -1;
  return 0;
});

// prev/next: prev = newer, next = older
for (let i = 0; i < index.length; i++) {
  index[i].prev = i < index.length - 1
    ? { slug: index[i + 1].slug, title: index[i + 1].title }
    : null;
  index[i].next = i > 0
    ? { slug: index[i - 1].slug, title: index[i - 1].title }
    : null;
}

// build each post
for (const post of index) {
  const raw = fs.readFileSync(path.join(postsDir, `${post.slug}.md`), 'utf8');
  const { body } = parseFrontmatter(raw);
  // reset usedIds for each post
  for (const k of Object.keys(usedIds)) delete usedIds[k];

  const fragment = marked.parse(body).trim();

  const html = buildPostHtml({
    slug: post.slug,
    title: post.title,
    date: post.date,
    tags: post.tags,
    series: post.series,
    readingTime: post.readingTime,
    prev: post.prev,
    next: post.next,
    fragment
  });

  fs.writeFileSync(path.join(postsDir, `${post.slug}.html`), html, 'utf8');
  console.log(`built: posts/${post.slug}.html`);
}

fs.writeFileSync(postsJson, JSON.stringify(index, null, 2), 'utf8');
console.log(`updated: posts.json (${index.length} posts)`);

// ── RSS feed ──
const SITE_URL = 'https://souls-syntax.github.io';
const SITE_TITLE = 'Aakarsh Kashyap';
const SITE_DESC = 'made with vim and spite';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(dateStr) {
  const d = dateStr ? new Date(dateStr + 'T00:00:00Z') : new Date();
  return isNaN(d) ? new Date().toUTCString() : d.toUTCString();
}

const rssItems = index.map(post => {
  const postUrl = `${SITE_URL}/${post.url}`;
  const tagsLine = post.tags && post.tags.length
    ? post.tags.map(t => `<category>${escapeXml(t)}</category>`).join('\n      ')
    : '';
  const seriesLine = post.series
    ? `<itunes:subtitle>series: ${escapeXml(post.series)}</itunes:subtitle>`
    : '';
  const descLine = post.excerpt
    ? `<description>${escapeXml(post.excerpt)}</description>`
    : `<description>${escapeXml(post.title)}</description>`;

  return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${postUrl}</link>
    <guid isPermaLink="true">${postUrl}</guid>
    <pubDate>${toRfc822(post.date)}</pubDate>
    ${descLine}
    ${tagsLine}
    ${seriesLine}
  </item>`;
}).join('\n');

const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>`;

const rssOut = path.join(path.dirname(postsJson), 'feed.xml');
fs.writeFileSync(rssOut, rssFeed, 'utf8');
console.log(`updated: feed.xml (${index.length} items)`);
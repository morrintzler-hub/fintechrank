# Blog Post Skill — The Fintech Rank

## Format
All blog posts are written as **Markdown files** stored in `/content/blog/[slug].md`

## Frontmatter (required fields)
```
---
title: "Full title with year"
date: "Month D, 2026"
readTime: "X min read"
category: "Comparison" | "Guide" | "Research"
categoryColor: "#2563eb" | "#fbbf24" | "#38bdf8" | "#c084fc" | "#4ade80"
excerpt: "2-3 sentence summary shown on blog listing page"
image: "/blog-[slug].png"  (optional - omit if no image yet)
---
```

## Length
**Minimum 1,000 words. Target 1,200-1,400 words.**
Never publish below 800 words — this was the problem with the previous JS-object format.

## Structure (required sections)

### 1. Opening paragraph (no heading)
- 2-3 sentences establishing the problem/context
- No fluff — get to the point immediately
- State what this guide does

### 2. Quick verdict (## Quick verdict)
- Bullet list: "Choose X if..." for each product compared
- This is the most-read section — make it specific and actionable
- Never use vague language like "best overall"

### 3. Body sections (## H2 headings)
Each section should cover ONE specific comparison dimension:
- Fees (with actual numbers, not "fees vary")
- Specific use cases
- Geographic availability
- Security/regulation
- Developer experience
- Pricing tables where relevant

### 4. Closing verdict (## The verdict or ## Bottom line)
- Concrete recommendation per user type
- Acknowledge tradeoffs honestly
- Never say one product is best for everyone

## Writing rules

**DO:**
- Use real numbers: "1.5% + 25p", "$599/month", "£85,000 FSCS protection"
- Name specific features: "Stripe Radar", "Deel EOR", "Monzo salary sorter"
- Give specific scenarios: "For a business processing £100,000/month..."
- Be honest about weaknesses of every product
- Use markdown tables for fee comparisons
- Write at a level that respects the reader's intelligence

**DO NOT:**
- Use vague superlatives: "best in class", "industry leading", "cutting edge"
- Write marketing copy — this is independent editorial research
- Pad with filler sentences to hit word count
- Recommend one product as universally best
- Use em dashes (—) or special Unicode characters in content
- Use emojis

## Markdown formatting
```markdown
## Section heading

Regular paragraph text here.

**Bold** for product names on first mention or key terms.

| Column 1 | Column 2 | Column 3 |
|---|---|---|
| Row data | Row data | Row data |

- Bullet point
- Bullet point
```

## How to add a new blog post

### Step 1: Write the markdown file
```bash
cat > content/blog/[slug].md << 'MDEOF'
---
[frontmatter]
---
[content]
MDEOF
```

### Step 2: Update blog listing (app/blog/page.js)
Find the placeholder entry and add:
```js
slug: 'your-slug',
published: true,
image: '/blog-image.png',  // if image exists
```

### Step 3: No changes needed to [slug]/page.js
The API route at `/app/api/blog/[slug]/route.js` reads the markdown file automatically.

### Step 4: Commit
```bash
git add content/blog/[slug].md app/blog/page.js
git commit -m "Add [topic] blog post"
git push origin main
```

## Image spec
- Size: **1200 x 630px**
- Format: PNG
- Filename: `blog-[slug].png`
- Location: `/public/blog-[slug].png`
- Style: Show brand logos/colors of companies being compared, clean background

## Category colors
- Comparison: `#2563eb` (blue)
- Guide: `#fbbf24` (amber)
- Research: `#c084fc` (purple)
- Crypto: `#c084fc` (purple)
- Business: `#4ade80` (green)
- Banking: `#009e80` (teal)

## Example word counts from published posts
- stripe-vs-paypal-2026.md: 1,133 words
- revolut-vs-wise-vs-monzo-2026.md: 1,322 words
- best-crypto-exchanges-2026.md: 1,240 words
- bnpl-guide-2026.md: 1,197 words
- best-business-banking-startups-2026.md: 1,206 words
- global-payroll-2026.md: 1,335 words
- how-to-choose-payment-gateway-2026.md: 1,424 words

## Blog post ideas pipeline
Scheduled in app/blog/page.js — add content here when ready to publish.

## CSS Requirements (globals.css)
The `.blog-content` styles must include `display: block` on all block elements and explicit margins. Without this, paragraphs and headings run together with no spacing.

Required CSS in `app/globals.css`:
```css
.blog-content { font-family: var(--font); font-size: 16px; line-height: 1.8; color: var(--text); }
.blog-content h2 { font-family: var(--heading); font-size: 1.4rem; font-weight: 700; color: var(--text); margin: 2.5rem 0 1rem; letter-spacing: -.02em; display: block; }
.blog-content h3 { font-family: var(--heading); font-size: 1.1rem; font-weight: 700; color: var(--text); margin: 2rem 0 .75rem; display: block; }
.blog-content p { margin: 0 0 1.4rem; color: var(--muted); line-height: 1.8; display: block; }
.blog-content strong { color: var(--text); font-weight: 700; }
.blog-content ul { margin: 1rem 0 1.4rem 1.5rem; display: block; }
.blog-content li { margin-bottom: .6rem; color: var(--muted); line-height: 1.7; display: list-item; }
.blog-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0 2rem; font-size: 14px; display: table; }
.blog-content td { padding: 10px 14px; border: 1px solid var(--border); color: var(--muted); vertical-align: top; }
.blog-content tr:first-child td { background: var(--bg2); font-weight: 600; color: var(--text); }
.blog-content tr:nth-child(even) td { background: var(--bg); }
```

## Markdown to HTML renderer (app/api/blog/[slug]/route.js)
The API route converts markdown to HTML. If spacing issues appear, the problem is either:
1. Missing `display: block` in CSS (fix globals.css)
2. Paragraphs not being wrapped in `<p>` tags (fix the regex in route.js)

## IMPORTANT: Update homepage widget on every new post

Every time a new blog post is published, update the `LATEST_POST` constant in `app/page.js`:

```bash
python3 << 'PYEOF'
with open('app/page.js') as f:
    c = f.read()

# Update these 5 fields with the new post details
c = c.replace(
    "  href: '/blog/OLD-SLUG',",
    "  href: '/blog/NEW-SLUG',"
)
c = c.replace(
    "  tag: 'OLD-TAG',",
    "  tag: 'NEW-TAG',"  # Comparison | Guide | Research
)
c = c.replace(
    "  title: 'OLD-TITLE',",
    "  title: 'NEW-TITLE',"
)
c = c.replace(
    "  subtitle: 'Old subtitle',",
    "  subtitle: 'New article · X min read',"
)
c = c.replace(
    "  description: 'OLD-DESC',",
    "  description: 'NEW-DESC',"
)

with open('app/page.js', 'w') as f:
    f.write(c)
print("done")
PYEOF
```

Or edit `app/page.js` directly — find `const LATEST_POST = {` near the top and update the 5 fields.

**Checklist for every new blog post:**
1. Write markdown file → `content/blog/[slug].md`
2. Update `app/blog/page.js` — add slug, published: true, image
3. Copy image to `public/blog-[slug].png`
4. Update `content/blog/[slug].md` frontmatter with image path
5. **Update `app/page.js` LATEST_POST constant** ← don't forget this
6. Run `googleindex` and `indexnow` after deploy

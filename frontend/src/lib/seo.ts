/**
 * Per-route document metadata.
 *
 * This is a single-page application, so the server hands every URL the same
 * `index.html`. Everything in that file's head — the title, the description,
 * and most damagingly the canonical link — therefore described the homepage on
 * all forty public routes.
 *
 * The canonical is the one that does real harm. `<link rel="canonical"
 * href="https://difaac.com/">` on a product page is not a missed opportunity,
 * it is an instruction: it tells a crawler that this page is a duplicate of
 * the homepage and should not be indexed in its own right. Every product,
 * solution, service and industry page was asking to be dropped from the index.
 *
 * So each route declares what it is, and this hook writes it into the head on
 * navigation. Google renders JavaScript before indexing, so a head written by
 * the client is read — but it has to actually differ per route, which until now
 * it did not.
 */

import { useEffect } from 'react'

export const SITE_URL = 'https://difaac.com'
export const SITE_NAME = 'Difaac'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

// Kept short enough that a search result does not truncate mid-word: roughly
// 60 characters for a title and 155 for a description are what Google renders
// before it cuts. The suffix counts towards that, which is why it is short.
const TITLE_SUFFIX = ' | Difaac'
const MAX_TITLE = 60

export type SeoInput = {
  /** The page's own title, without the site name. */
  title: string
  description: string
  /** Path only, e.g. `/products/threat-intelligence`. Leading slash required. */
  path: string
  /** Absolute URL of the share image. Falls back to the site default. */
  image?: string
  /** `article` for blog posts and resources; `website` otherwise. */
  type?: 'website' | 'article'
  /**
   * Keep this page out of search results. Used for the pages that need a
   * session to render anything, so a crawler only ever sees an empty shell.
   */
  noindex?: boolean
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function removeMeta(selector: string) {
  document.head.querySelector(selector)?.remove()
}

export function applySeo({ title, description, path, image, type = 'website', noindex }: SeoInput) {
  // The suffix is what puts the brand in a search result, but it is skipped
  // when the title already carries the name — "About Difaac | Difaac" spends
  // characters that count against the truncation limit to say nothing — and
  // when appending it would push the whole thing past what Google renders.
  const named = /\bdifaac\b/i.test(title)
  const full =
    !named && title.length + TITLE_SUFFIX.length <= MAX_TITLE
      ? `${title}${TITLE_SUFFIX}`
      : title
  // A trailing slash on the root and none anywhere else, so the canonical a
  // crawler is given always matches the URL the sitemap lists.
  const url = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/$/, '')}`

  document.title = full
  setMeta('meta[name="description"]', 'name', 'description', description)
  setLink('canonical', url)

  setMeta('meta[property="og:title"]', 'property', 'og:title', title)
  setMeta('meta[property="og:description"]', 'property', 'og:description', description)
  setMeta('meta[property="og:url"]', 'property', 'og:url', url)
  setMeta('meta[property="og:type"]', 'property', 'og:type', type)
  setMeta('meta[property="og:image"]', 'property', 'og:image', image ?? DEFAULT_IMAGE)

  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image ?? DEFAULT_IMAGE)

  if (noindex) {
    setMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow')
  } else {
    // Removed rather than set to `index`, because a page that was noindex a
    // navigation ago must not keep the tag once the user moves to one that
    // should be indexed.
    removeMeta('meta[name="robots"]')
  }
}

/**
 * Declare what this route is. Re-runs whenever the values change, which is
 * what makes a detail page update when its slug does.
 */
export function useSeo(input: SeoInput) {
  const { title, description, path, image, type, noindex } = input
  useEffect(() => {
    applySeo({ title, description, path, image, type, noindex })
  }, [title, description, path, image, type, noindex])
}

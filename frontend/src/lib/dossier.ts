/**
 * Threat dossier export.
 *
 * The download button used to call `alert()` and tell the reader the dossier
 * "has been prepared and downloaded". Nothing was prepared and nothing was
 * downloaded. For a security company that is worse than having no button: an
 * analyst who clicks it, sees the confirmation, and then cannot find the file
 * has been told something untrue by the product.
 *
 * The content was never the missing part. Every article already carries its
 * executive summary, key findings, kill chain, MITRE mapping, indicators and
 * YARA rule; they were rendered on screen and thrown away. This assembles them
 * into a file an analyst can actually keep, diff, and paste into a ticket.
 *
 * Markdown rather than PDF, and the buttons say so. Producing a real PDF in
 * the browser means bundling a rendering library for a feature whose whole
 * value is the text inside it — and a plain-text format is what an IOC list
 * and a YARA rule want to be anyway: greppable, diffable, and readable by the
 * tools that consume them.
 */

export type DossierIoc = {
  type: string
  indicator: string
  description: string
}

export type DossierArticle = {
  slug: string
  title: string
  subtitle: string
  category: string
  tlp: string
  author: { name: string; role: string }
  date: string
  tags: string[]
  executiveSummary: string
  keyFindings: string[]
  killChainSteps: { phase: string; tactic: string; techniqueId: string; details: string }[]
  mitreAttack: { tactic: string; id: string; technique: string; description: string }[]
  iocs: DossierIoc[]
  yaraRule: string
  mitigationSteps: string[]
}

/** A filename-safe stem for the download. */
function fileStem(article: DossierArticle): string {
  const slug = article.slug.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-')
  return `difaac-${slug}`
}

/** Escape a cell so a pipe inside an indicator cannot break the table. */
function cell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

export function buildDossier(article: DossierArticle): string {
  const lines: string[] = []

  lines.push(`# ${article.title}`)
  lines.push('')
  lines.push(`_${article.subtitle}_`)
  lines.push('')
  // The handling marking goes at the top, where whoever opens the file sees it
  // before the content it governs.
  lines.push(`**${article.tlp}**`)
  lines.push('')
  lines.push(`| | |`)
  lines.push(`| --- | --- |`)
  lines.push(`| Category | ${cell(article.category)} |`)
  lines.push(`| Published | ${cell(article.date)} |`)
  lines.push(`| Author | ${cell(article.author.name)}, ${cell(article.author.role)} |`)
  if (article.tags.length) lines.push(`| Tags | ${cell(article.tags.join(', '))} |`)
  lines.push(`| Source | Difaac Cyber Defence Lab — https://difaac.com/resources/${article.slug} |`)
  lines.push('')

  lines.push('## Executive summary')
  lines.push('')
  lines.push(article.executiveSummary)
  lines.push('')

  if (article.keyFindings.length) {
    lines.push('## Key findings')
    lines.push('')
    for (const finding of article.keyFindings) lines.push(`- ${finding}`)
    lines.push('')
  }

  if (article.killChainSteps.length) {
    lines.push('## Kill chain')
    lines.push('')
    lines.push('| Phase | Tactic | Technique | Detail |')
    lines.push('| --- | --- | --- | --- |')
    for (const step of article.killChainSteps) {
      lines.push(
        `| ${cell(step.phase)} | ${cell(step.tactic)} | ${cell(step.techniqueId)} | ${cell(step.details)} |`,
      )
    }
    lines.push('')
  }

  if (article.mitreAttack.length) {
    lines.push('## MITRE ATT&CK')
    lines.push('')
    lines.push('| Tactic | ID | Technique | Description |')
    lines.push('| --- | --- | --- | --- |')
    for (const t of article.mitreAttack) {
      lines.push(
        `| ${cell(t.tactic)} | ${cell(t.id)} | ${cell(t.technique)} | ${cell(t.description)} |`,
      )
    }
    lines.push('')
  }

  if (article.iocs.length) {
    lines.push('## Indicators of compromise')
    lines.push('')
    lines.push('| Type | Indicator | Description |')
    lines.push('| --- | --- | --- |')
    for (const ioc of article.iocs) {
      // The indicator goes in backticks so a defanged domain is not rewritten
      // as a link by whatever renders this next.
      lines.push(`| ${cell(ioc.type)} | \`${cell(ioc.indicator)}\` | ${cell(ioc.description)} |`)
    }
    lines.push('')
    // A plain list as well as the table: this is the half an analyst pastes
    // into a block list, and pulling it back out of a table is needless work.
    lines.push('### Indicators, one per line')
    lines.push('')
    lines.push('```')
    for (const ioc of article.iocs) lines.push(ioc.indicator)
    lines.push('```')
    lines.push('')
  }

  if (article.yaraRule?.trim()) {
    lines.push('## YARA rule')
    lines.push('')
    lines.push('```yara')
    lines.push(article.yaraRule.trim())
    lines.push('```')
    lines.push('')
  }

  if (article.mitigationSteps.length) {
    lines.push('## Recommended mitigations')
    lines.push('')
    article.mitigationSteps.forEach((step, index) => lines.push(`${index + 1}. ${step}`))
    lines.push('')
  }

  lines.push('---')
  lines.push('')
  lines.push(
    `Exported from Difaac on ${new Date().toISOString().slice(0, 10)}. ` +
      `Handling: ${article.tlp}.`,
  )
  lines.push('')

  return lines.join('\n')
}

/**
 * Write the dossier to the reader's disk. Returns the filename actually used,
 * so the caller can name it in the confirmation rather than guess.
 */
export function downloadDossier(article: DossierArticle): string {
  const filename = `${fileStem(article)}.md`
  const blob = new Blob([buildDossier(article)], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  // Freed on the next tick rather than immediately: revoking synchronously can
  // race the browser's own read of the blob and produce an empty file.
  setTimeout(() => URL.revokeObjectURL(url), 0)

  return filename
}

/**
 * Relative time, to the coarsest useful unit.
 *
 * A console list is scanned, not read: "4h ago" answers "is this still live?"
 * at a glance, where a full timestamp makes the reader do the subtraction.
 * The exact time stays available in the tables, which show the real value.
 */
export function timeAgo(iso: string): string {
  const value = new Date(toUtc(iso))
  const minutes = Math.round((Date.now() - value.getTime()) / 60_000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

/** Absolute local time, for the tables where the exact moment matters. */
export function formatDateTime(iso: string): string {
  return new Date(toUtc(iso)).toLocaleString()
}

/**
 * SQLite writes `YYYY-MM-DD HH:MM:SS` in UTC with no zone marker, which
 * JavaScript would otherwise read as local time and render hours adrift.
 * Anything already carrying a `T` and a zone is left alone.
 */
function toUtc(iso: string): string {
  return iso.includes('T') ? iso : `${iso.replace(' ', 'T')}Z`
}

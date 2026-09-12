import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, Monitor, LogOut, KeyRound, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Panel } from '@/components/workspace/panel'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { changePassword, signOut } from '@/lib/auth'
import { useSessions, revokeSession } from '@/lib/account-api'
import { useApiKeys, createApiKey, revokeApiKey } from '@/lib/keys-api'
import { useHasPermission, PERMISSION } from '@/hooks/use-permission'

function ChangePasswordForm() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (next !== confirm) {
      setError('New passwords do not match.')
      return
    }

    setLoading(true)
    try {
      // Changing the password revokes every session, including this one, so
      // the only place to go afterwards is back to sign-in.
      await changePassword(current, next)
      navigate('/sign-in', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change the password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="current" className="text-xs font-medium text-text uppercase tracking-wider">
          Current Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 size-4 text-muted-2" />
          <Input
            id="current"
            type="password"
            required
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="bg-ink-3 border-line pl-10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="next" className="text-xs font-medium text-text uppercase tracking-wider">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 size-4 text-muted-2" />
          <Input
            id="next"
            type="password"
            required
            minLength={12}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="bg-ink-3 border-line pl-10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm" className="text-xs font-medium text-text uppercase tracking-wider">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 size-4 text-muted-2" />
          <Input
            id="confirm"
            type="password"
            required
            minLength={12}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="bg-ink-3 border-line pl-10"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-error/20 bg-error/10 p-3 text-center text-xs font-medium text-error">
          {error}
        </div>
      )}

      <p className="text-xs text-muted-2">Changing your password signs you out everywhere, including here.</p>

      <Button type="submit" disabled={loading} className="w-fit">
        {loading ? 'Updating...' : 'Update password'}
        {!loading && <ArrowRight className="size-4 ml-1" data-icon="inline-end" />}
      </Button>
    </form>
  )
}

function SessionsList() {
  const { sessions, error, isLoading, refresh } = useSessions()
  const [revokingId, setRevokingId] = useState<number | null>(null)
  const navigate = useNavigate()

  async function handleRevoke(id: number) {
    setRevokingId(id)
    try {
      await revokeSession(id)
      await refresh()
    } finally {
      setRevokingId(null)
    }
  }

  async function handleSignOutEverywhere() {
    await signOut()
    navigate('/sign-in', { replace: true })
  }

  return (
    <Panel
      title="Active Sessions"
      description="Devices and browsers currently signed in to your account."
      loading={isLoading}
      error={error}
      empty={sessions.length === 0}
    >
      <ul className="flex flex-col divide-y divide-line-soft">
        {sessions.map((session) => (
          <li key={session.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
              <Monitor className="mt-0.5 size-4 shrink-0 text-muted-2" aria-hidden="true" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-text">
                  {session.ip_address ?? 'Unknown location'}
                  {session.current ? (
                    <span className="ml-2 rounded-[3px] border border-brand/40 bg-brand/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-brand">
                      This device
                    </span>
                  ) : null}
                </span>
                <span className="line-clamp-1 max-w-md text-xs text-muted-2">
                  {session.user_agent ?? 'Unknown device'} · Signed in {new Date(session.issued_at).toLocaleString()}
                </span>
              </div>
            </div>
            {!session.current ? (
              <button
                type="button"
                onClick={() => handleRevoke(session.id)}
                disabled={revokingId === session.id}
                className="shrink-0 text-xs font-medium text-error hover:underline disabled:opacity-50"
              >
                {revokingId === session.id ? 'Revoking...' : 'Revoke'}
              </button>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-line-soft pt-5">
        <button
          type="button"
          onClick={handleSignOutEverywhere}
          className="flex items-center gap-2 text-xs font-medium text-error hover:underline"
        >
          <LogOut className="size-3.5" aria-hidden="true" />
          Sign out of all devices
        </button>
      </div>
    </Panel>
  )
}

function ApiKeysSection() {
  const { keys, error, isLoading, refresh } = useApiKeys()
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [freshKey, setFreshKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setCreating(true)
    try {
      const created = await createApiKey(name.trim())
      setFreshKey(created.key)
      setName('')
      await refresh()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not create the key.')
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(prefix: string) {
    await revokeApiKey(prefix)
    await refresh()
  }

  return (
    <Panel
      title="Integration API keys"
      description="Issue a key for an application that reports events to Difaac — a hospital's record system, say. The key is shown once; store it safely and revoke it if it leaks."
      loading={isLoading}
      error={error}
      empty={keys.length === 0 && !freshKey}
      emptyLabel="No keys yet. Generate one below to connect an application."
      action={
        <form onSubmit={handleCreate} className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Banadir EHR"
            required
            maxLength={120}
            className="h-9 w-44"
          />
          <Button type="submit" size="sm" disabled={creating || !name.trim()} className="gap-1.5">
            <KeyRound className="size-4" aria-hidden="true" />
            {creating ? 'Generating…' : 'Generate'}
          </Button>
        </form>
      }
    >
      {formError ? <p className="mb-4 text-sm text-error">{formError}</p> : null}

      {freshKey ? (
        <div className="mb-5 rounded-[6px] border border-brand/40 bg-brand/10 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand">
            Copy this key now — it will not be shown again
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-[4px] bg-ink px-3 py-2 text-xs text-text">
              {freshKey}
            </code>
            <Button
              size="sm"
              variant="secondary"
              className="gap-1.5"
              onClick={() => {
                navigator.clipboard.writeText(freshKey)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      ) : null}

      {keys.length > 0 ? (
        <div className="-mx-6 overflow-x-auto lg:-mx-7">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line-soft text-left text-xs uppercase tracking-wide text-muted-2">
                <th className="px-6 py-3 font-medium lg:px-7">Name</th>
                <th className="px-6 py-3 font-medium lg:px-7">Prefix</th>
                <th className="px-6 py-3 font-medium lg:px-7">Last used</th>
                <th className="px-6 py-3 font-medium lg:px-7">Status</th>
                <th className="px-6 py-3 font-medium lg:px-7"></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.prefix} className="border-b border-line-soft/60 last:border-0">
                  <td className="px-6 py-3 font-medium text-text lg:px-7">{k.name}</td>
                  <td className="px-6 py-3 lg:px-7">
                    <code className="rounded-[3px] bg-ink-3 px-1.5 py-0.5 text-xs text-body">
                      {k.prefix}
                    </code>
                  </td>
                  <td className="px-6 py-3 text-muted-2 lg:px-7">
                    {k.last_used_at ? new Date(k.last_used_at).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-6 py-3 lg:px-7">
                    <SeverityBadge value={k.revoked_at ? 'revoked' : 'active'} />
                  </td>
                  <td className="px-6 py-3 text-right lg:px-7">
                    {!k.revoked_at ? (
                      <button
                        type="button"
                        onClick={() => handleRevoke(k.prefix)}
                        className="text-xs font-medium text-muted-2 hover:text-error"
                      >
                        Revoke
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Panel>
  )
}

export default function SettingsPage() {
  const canManageIntegrations = useHasPermission(PERMISSION.integrationsManage)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-text">Account Settings</h1>
        <p className="mt-1 text-sm text-body">Manage your password and see where you&apos;re signed in.</p>
      </div>

      <section className="flat-card p-6 lg:p-7">
        <h2 className="mb-5 font-display text-lg font-medium text-text">Change Password</h2>
        <ChangePasswordForm />
      </section>

      {canManageIntegrations ? <ApiKeysSection /> : null}

      <SessionsList />
    </div>
  )
}

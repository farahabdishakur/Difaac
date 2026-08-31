import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, Monitor, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Panel } from '@/components/workspace/panel'
import { changePassword, signOut } from '@/lib/auth'
import { useSessions, revokeSession } from '@/lib/account-api'

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
        <label htmlFor="current" className="text-xs font-semibold text-text uppercase tracking-wider">
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
        <label htmlFor="next" className="text-xs font-semibold text-text uppercase tracking-wider">
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
        <label htmlFor="confirm" className="text-xs font-semibold text-text uppercase tracking-wider">
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

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">Account Settings</h1>
        <p className="mt-1 text-sm text-body">Manage your password and see where you&apos;re signed in.</p>
      </div>

      <section className="flat-card p-6 lg:p-7">
        <h2 className="mb-5 font-display text-lg font-semibold text-text">Change Password</h2>
        <ChangePasswordForm />
      </section>

      <SessionsList />
    </div>
  )
}

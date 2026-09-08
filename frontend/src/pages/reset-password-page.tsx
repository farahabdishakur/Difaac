import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LogoMark } from '@/components/layout/logo-mark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { resetPassword } from '@/lib/auth'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await resetPassword(token, password)
      setDone(true)
      setTimeout(() => navigate('/sign-in', { replace: true }), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset the password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center gap-4 text-center">
        <LogoMark />
        <h2 className="font-display text-2xl font-medium text-text">Choose a new password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flat-card p-8 sm:p-10">
          {!token ? (
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <p className="text-sm text-body">
                This link is missing its reset token. Request a new one from the sign-in page.
              </p>
              <Link to="/forgot-password" className="text-xs font-medium text-brand hover:underline">
                Request a new link &rarr;
              </Link>
            </div>
          ) : done ? (
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <ShieldCheck className="size-14 text-brand" />
              <h3 className="font-display text-xl font-medium text-text">Password updated</h3>
              <p className="text-sm text-body">Redirecting you to sign in...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-medium text-text uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 size-4 text-muted-2" />
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={12}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="bg-ink-3 border-line pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm" className="text-xs font-medium text-text uppercase tracking-wider">
                  Confirm Password
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
                    placeholder="••••••••••••"
                    className="bg-ink-3 border-line pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-md p-3 text-center font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full justify-center bg-brand text-brand-ink hover:bg-brand-bright font-medium mt-2"
              >
                {loading ? 'Updating...' : 'Update password'}
                {!loading && <ArrowRight className="size-4 ml-1" />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

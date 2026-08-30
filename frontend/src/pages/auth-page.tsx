import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogoMark } from '@/components/layout/logo-mark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Mail, ArrowRight, Shield } from 'lucide-react'
import { signIn } from '@/lib/auth'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  // `ProtectedRoute` sends visitors here with the page they were trying to
  // reach in `state.from`, so signing in returns them there instead of
  // always dropping them on the overview.
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/workspace'

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // The access token is kept in memory by the auth client and the refresh
      // token arrives as an HttpOnly cookie, so nothing sensitive is written to
      // localStorage where page scripts could read it.
      await signIn(email, password)
      setSignedIn(true)
      setTimeout(() => navigate(redirectTo, { replace: true }), 700)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication service unavailable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center gap-4 text-center">
        <LogoMark />
        <h2 className="font-display text-2xl font-bold text-text">Sign in to Difaac Platform</h2>
        <p className="text-xs text-body">
          Access real-time threat intelligence feeds, incident dashboards, and SOC workspace.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flat-card p-8 sm:p-10">
          {signedIn ? (
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <Shield className="size-14 text-brand" />
              <h3 className="font-display text-xl font-bold text-text">Authentication Successful</h3>
              <p className="text-sm text-body">Redirecting to your security workspace...</p>
              <Link to={redirectTo} className="text-xs font-semibold text-brand hover:underline mt-2">
                Go to Dashboard &rarr;
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-text uppercase tracking-wider">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-muted-2" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@organization.com"
                    className="bg-ink-3 border-line pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-xs font-semibold text-text uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#forgot" className="text-xs text-brand hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 size-4 text-muted-2" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="bg-ink-3 border-line pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-md p-3 text-center font-medium animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full justify-center bg-brand text-brand-ink hover:bg-brand-bright font-semibold mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight className="size-4 ml-1" />}
              </Button>

              <div className="border-t border-line-soft pt-4 text-center">
                <p className="text-xs text-muted-2">
                  SSO Enforced for Enterprise Accounts.{' '}
                  <Link to="/talk-to-sales" className="text-brand hover:underline">
                    Request SSO setup
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

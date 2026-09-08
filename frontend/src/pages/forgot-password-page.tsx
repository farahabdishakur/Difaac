import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogoMark } from '@/components/layout/logo-mark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react'
import { requestPasswordReset } from '@/lib/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await requestPasswordReset(email)
      // Always shown on success, regardless of whether the address is
      // registered — the API deliberately gives the same answer either way.
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process this request right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center gap-4 text-center">
        <LogoMark />
        <h2 className="font-display text-2xl font-medium text-text">Reset your password</h2>
        <p className="text-xs text-body">
          Enter your corporate email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flat-card p-8 sm:p-10">
          {sent ? (
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <MailCheck className="size-14 text-brand" />
              <h3 className="font-display text-xl font-medium text-text">Check your email</h3>
              <p className="text-sm text-body">
                If <span className="text-text">{email}</span> is registered, a reset link is on its way.
              </p>
              <Link to="/sign-in" className="text-xs font-medium text-brand hover:underline mt-2">
                &larr; Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-text uppercase tracking-wider">
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
                {loading ? 'Sending...' : 'Send reset link'}
                {!loading && <ArrowRight className="size-4 ml-1" />}
              </Button>

              <div className="border-t border-line-soft pt-4 text-center">
                <Link
                  to="/sign-in"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-2 hover:text-brand"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

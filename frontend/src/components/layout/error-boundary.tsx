import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

type Props = {
  children: ReactNode
}

type State = {
  error: Error | null
}

/**
 * Catches render errors so one broken component does not blank the whole site.
 *
 * Without a boundary, React unmounts the entire tree when any component throws
 * and the visitor is left looking at an empty page with no indication that
 * anything went wrong, or what to do about it.
 *
 * This has to be a class: `componentDidCatch` and `getDerivedStateFromError`
 * have no hook equivalent.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Kept in the console rather than shown on screen: a stack trace tells a
    // visitor nothing useful and can disclose application internals.
    console.error('Unhandled render error:', error, info.componentStack)
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    const { error } = this.state

    if (!error) {
      return this.props.children
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-24">
        <div className="w-full max-w-md rounded-lg border border-line bg-ink-2 p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-brand-ink">
            <AlertTriangle className="size-6 text-brand" aria-hidden="true" />
          </div>

          <h1 className="mt-6 font-display text-xl font-medium text-text">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-body">
            This page failed to load. Reloading usually resolves it. If it keeps
            happening, please let us know.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-brand px-4 py-2.5 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-bright"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Reload the page
            </button>

            <a
              href="/"
              className="text-sm font-medium text-body transition-colors hover:text-brand"
            >
              Return to the homepage
            </a>
          </div>
        </div>
      </div>
    )
  }
}

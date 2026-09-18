'use client';

/**
 * Root error boundary.
 *
 * Next generates this route implicitly, but an implicit one is not prerenderable
 * in this configuration — declaring it explicitly keeps the build deterministic
 * and gives us control over what a visitor sees when the app throws.
 *
 * It replaces the root layout, so it must render its own <html> and <body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          background: '#f7f8f9',
          color: '#2f353b',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#2c5b7d',
              margin: 0,
            }}
          >
            YILON
          </p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '1rem 0 0', color: '#142a3a' }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: '1rem', lineHeight: 1.6, color: '#56606b' }}>
            The page failed to load. Please try again — if it keeps happening, email us at{' '}
            <a href="mailto:shishunhai2026@gmail.com" style={{ color: '#264b66' }}>
              shishunhai2026@gmail.com
            </a>{' '}
            and we will send what you need directly.
          </p>
          {error.digest ? (
            <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#9aa4af' }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.75rem',
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#fff',
              background: '#fb5a12',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

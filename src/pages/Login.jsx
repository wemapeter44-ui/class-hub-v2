import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login({ onSwitchToSignUp }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 22
    }}>
      <div style={{
        width: 'min(420px, 100%)', padding: '34px 30px 30px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface)',
        border: '1px solid var(--border-strong)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative', overflow: 'hidden',
        animation: 'fadeUp .7s cubic-bezier(.16,1,.3,1) both',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, display: 'grid', placeItems: 'center',
          background: 'var(--gradient)', color: '#04121a',
          fontWeight: 900, fontSize: 16, letterSpacing: '-.5px',
          marginBottom: 22,
          boxShadow: '0 12px 32px -12px rgba(34,211,238,.55)',
        }}>PD</div>
        <h1 style={{
          fontSize: 22, fontWeight: 800, letterSpacing: '-.6px', marginBottom: 6,
          background: 'linear-gradient(180deg,#fff,#c8d1e0)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>Class Hub</h1>
        <p style={{ color: 'var(--muted)', fontSize: 12.5, marginBottom: 26, fontWeight: 500 }}>
          ICT(6)26S M1-C • Sign in to continue
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 11,
                background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)',
                color: 'var(--text)', outline: 'none', fontSize: 13.5,
              }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 11,
                background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)',
                color: 'var(--text)', outline: 'none', fontSize: 13.5,
              }}
            />
          </div>

          {error && (
            <div style={{
              color: 'var(--danger)', fontSize: 12, marginTop: 12, textAlign: 'center'
            }}>{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', marginTop: 6, padding: '12px 18px', borderRadius: 11,
              background: 'var(--gradient)', color: '#04121a',
              fontWeight: 700, fontSize: 13, border: 0, cursor: 'pointer',
              boxShadow: '0 8px 22px -10px rgba(34,211,238,.55)',
              opacity: loading ? 0.55 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignUp}
            style={{ color: 'var(--accent)', fontWeight: 600, background: 'none', border: 0, cursor: 'pointer' }}
          >
            Sign up
          </button>
        </p>

        <p style={{
          textAlign: 'center', fontSize: 10.5, color: 'var(--muted)',
          marginTop: 20, letterSpacing: '.4px', textTransform: 'uppercase', fontWeight: 600,
        }}>
          © 2026 PDT Softwares
        </p>
      </div>
    </div>
  );
}

export default Login;
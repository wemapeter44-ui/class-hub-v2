import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function SignUp({ onSwitchToLogin }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 11,
    background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)',
    color: 'var(--text)', outline: 'none', fontSize: 13.5,
  };

  const labelStyle = {
    display: 'block', color: 'var(--text-2)',
    fontSize: 11.5, fontWeight: 600, marginBottom: 7,
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 22 }}>
        <div style={{
          width: 'min(420px, 100%)', padding: '34px 30px 30px',
          borderRadius: 'var(--radius-lg)', background: 'var(--surface)',
          border: '1px solid var(--border-strong)', backdropFilter: 'blur(24px)',
          boxShadow: 'var(--shadow-lg)', textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto 20px', borderRadius: '50%',
            background: 'rgba(52,211,153,.15)', border: '1px solid rgba(52,211,153,.3)',
            display: 'grid', placeItems: 'center', color: 'var(--success)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Account Created</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>
            You can now sign in with your credentials
          </p>
          <button onClick={onSwitchToLogin} style={{
            width: '100%', padding: '12px 18px', borderRadius: 11,
            background: 'var(--gradient)', color: '#04121a',
            fontWeight: 700, fontSize: 13, border: 0, cursor: 'pointer',
            boxShadow: '0 8px 22px -10px rgba(34,211,238,.55)',
          }}>Continue to Sign in</button>
          <p style={{
            textAlign: 'center', fontSize: 10.5, color: 'var(--muted)',
            marginTop: 20, letterSpacing: '.4px', textTransform: 'uppercase', fontWeight: 600,
          }}>© 2026 PDT Softwares</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 22 }}>
      <div style={{
        width: 'min(420px, 100%)', padding: '34px 30px 30px',
        borderRadius: 'var(--radius-lg)', background: 'var(--surface)',
        border: '1px solid var(--border-strong)', backdropFilter: 'blur(24px)',
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
        }}>Create Account</h1>
        <p style={{ color: 'var(--muted)', fontSize: 12.5, marginBottom: 26, fontWeight: 500 }}>
          Join ICT(6)26S M1-C Class Hub
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" required style={inputStyle} />
          </div>

          {error && (
            <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 12, textAlign: 'center' }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', marginTop: 6, padding: '12px 18px', borderRadius: 11,
            background: 'var(--gradient)', color: '#04121a',
            fontWeight: 700, fontSize: 13, border: 0, cursor: 'pointer',
            boxShadow: '0 8px 22px -10px rgba(34,211,238,.55)',
            opacity: loading ? 0.55 : 1,
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} style={{ color: 'var(--accent)', fontWeight: 600, background: 'none', border: 0, cursor: 'pointer' }}>
            Sign in
          </button>
        </p>

        <p style={{
          textAlign: 'center', fontSize: 10.5, color: 'var(--muted)',
          marginTop: 20, letterSpacing: '.4px', textTransform: 'uppercase', fontWeight: 600,
        }}>© 2026 PDT Softwares</p>
      </div>
    </div>
  );
}

export default SignUp;
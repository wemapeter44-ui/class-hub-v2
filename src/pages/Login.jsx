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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-6">
          <div className="w-11 h-11 mx-auto mb-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-white tracking-tight">Class Hub</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/70 rounded-lg p-5">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2.5 text-xs text-red-400 animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-slate-950 font-semibold text-sm py-2 rounded-md hover:bg-slate-100 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800/70 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-4 tracking-wider uppercase">
          © 2026 PDT Softwares
        </p>
      </div>
    </div>
  );
}

export default Login;
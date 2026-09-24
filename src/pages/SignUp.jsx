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

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="bg-slate-900/50 border border-slate-800/70 rounded-lg p-6 text-center">
            <div className="w-11 h-11 mx-auto mb-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-base font-semibold text-white mb-1.5">Account Created</h1>
            <p className="text-xs text-slate-500 mb-5">
              You can now sign in with your credentials
            </p>
            <button
              onClick={onSwitchToLogin}
              className="w-full bg-white text-slate-950 font-semibold text-sm py-2 rounded-md hover:bg-slate-100 active:scale-[0.98] transition"
            >
              Continue to Sign in
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-600 mt-4 tracking-wider uppercase">
            © 2026 PDT Softwares
          </p>
        </div>
      </div>
    );
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
          <h1 className="text-lg font-semibold text-white tracking-tight">Create Account</h1>
          <p className="text-xs text-slate-500 mt-1">Join ICT(6)26S M1-C</p>
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
                placeholder="At least 6 characters"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800/70 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition"
              >
                Sign in
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

export default SignUp;
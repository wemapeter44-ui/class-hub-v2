import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login({ onNavigate }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      // Success — auth state change handles redirect
    } catch (err) {
      setError(err?.message || 'Failed to sign in');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] relative overflow-hidden flex flex-col">
      <div className="brand-gradient rounded-b-[3rem] pt-16 pb-20 px-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -left-16 w-44 h-44 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-4 shadow-lg animate-float">
            <img src="/kcnp-logo.png" alt="KCNP" className="w-11 h-11 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-xs text-white/80 mt-1.5">Sign in to Class Hub</p>
        </div>
      </div>

      <div className="flex-1 px-5 -mt-10 pb-8 relative z-20">
        <form onSubmit={handleSubmit} className="surface p-6 space-y-5 animate-fade-up">
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 animate-fade-up">
              {error}
            </div>
          )}

          <div className="relative">
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 rounded-xl bg-[#faf9ff] border border-[#e9e5ff] text-sm text-[#1e1b4b] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
            <label
              htmlFor="login-email"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none transition-all duration-200
                         peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-violet-600
                         peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:tracking-wider peer-[&:not(:placeholder-shown)]:text-violet-600"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              id="login-password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 pr-11 rounded-xl bg-[#faf9ff] border border-[#e9e5ff] text-sm text-[#1e1b4b] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
            <label
              htmlFor="login-password"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none transition-all duration-200
                         peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-violet-600
                         peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:tracking-wider peer-[&:not(:placeholder-shown)]:text-violet-600"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 active:scale-90 transition p-1"
            >
              {showPass ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl brand-gradient text-white font-semibold text-sm shadow-md shadow-violet-500/25 active:scale-[0.97] transition disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Signing in...
              </span>
            ) : 'Sign in'}
          </button>

          <p className="text-center text-xs text-gray-500 pt-2">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="font-semibold text-violet-600 hover:text-violet-700 active:scale-95 transition inline-block"
            >
              Sign up
            </button>
          </p>
        </form>

        <p className="text-[10px] text-gray-400 text-center mt-8">© 2026 PDT Softwares</p>
      </div>
    </div>
  );
}

export default Login;
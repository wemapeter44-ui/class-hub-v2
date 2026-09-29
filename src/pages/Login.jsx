import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login({ onNavigate }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/kcnp-gate.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-[#0a120a]/90"></div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/kcnp-logo.png"
            alt="KCNP"
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-bold text-white">CLASS HUB</h1>
          <p className="text-xs text-green-400 mt-1">Kenya Coast National Polytechnic</p>
          <p className="text-[10px] text-yellow-500 mt-1 tracking-wider">ICT(6)26S M1-C</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0d1a0d]/95 backdrop-blur-sm border border-green-900/40 rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-xs text-green-400 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-[#0a120a] border border-green-900/50 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs text-green-400 mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-[#0a120a] border border-green-900/50 rounded-md px-3 py-2 pr-14 text-sm text-white focus:outline-none focus:border-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 text-xs"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-xs text-green-400 pt-1">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-yellow-500 hover:text-yellow-400 font-medium underline"
            >
              Sign up
            </button>
          </p>
        </form>

        <p className="text-center text-[10px] text-green-500 mt-6 tracking-wider uppercase">
          © 2026 PDT Softwares
        </p>
      </div>
    </div>
  );
}

export default Login;
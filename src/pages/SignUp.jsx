import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function SignUp({ onNavigate }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

        {success ? (
          <div className="bg-[#0d1a0d]/95 backdrop-blur-sm border border-green-900/40 rounded-lg p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white">Account Created</h2>
            <p className="text-xs text-green-400">You can now sign in with your credentials</p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2 rounded-md transition"
            >
              Continue to Sign in
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#0d1a0d]/95 backdrop-blur-sm border border-green-900/40 rounded-lg p-6 space-y-4"
          >
            <div>
              <label className="block text-xs text-green-400 mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-[#0a120a] border border-green-900/50 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs text-green-400 mb-2 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="At least 6 characters"
                  className="w-full bg-[#0a120a] border border-green-900/50 rounded-md px-3 py-2 pr-14 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
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

            <div>
              <label className="block text-xs text-green-400 mb-2 font-medium">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat password"
                className="w-full bg-[#0a120a] border border-green-900/50 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-xs text-green-400 pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-yellow-500 hover:text-yellow-400 font-medium underline"
              >
                Sign in
              </button>
            </p>
          </form>
        )}

        <p className="text-center text-[10px] text-green-500 mt-6 tracking-wider uppercase">
          © 2026 PDT Softwares
        </p>
      </div>
    </div>
  );
}

export default SignUp;
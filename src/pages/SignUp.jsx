import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function SignUp({ onNavigate }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const floatLabel =
    'absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none transition-all duration-200 ' +
    'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-violet-600 ' +
    'peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:tracking-wider peer-[&:not(:placeholder-shown)]:text-violet-600';

  const inputCls =
    'peer w-full px-4 pt-6 pb-2 rounded-xl bg-[#faf9ff] border border-[#e9e5ff] text-sm text-[#1e1b4b] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all';

  const inputWithIcon = inputCls + ' pr-11';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  }

  function EyeButton({ shown, onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 active:scale-90 transition p-1"
      >
        {shown ? (
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
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center px-5">
        <div className="surface p-8 max-w-sm w-full text-center animate-fade-up">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-4 animate-float">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#1e1b4b]">Check your email</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            We sent a confirmation link to <strong className="text-[#1e1b4b]">{email}</strong>.
            Click it to activate your account.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="mt-5 w-full py-3 rounded-xl brand-gradient text-white font-semibold text-sm shadow-md shadow-violet-500/25 active:scale-[0.97] transition"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-xs text-white/80 mt-1.5">Join Class Hub today</p>
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
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
              className={inputCls}
            />
            <label htmlFor="signup-email" className={floatLabel}>Email</label>
          </div>

          <div className="relative">
            <input
              id="signup-password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
              className={inputWithIcon}
            />
            <label htmlFor="signup-password" className={floatLabel}>Password</label>
            <EyeButton shown={showPass} onClick={() => setShowPass(!showPass)} />
          </div>

          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder=" "
              className={inputWithIcon}
            />
            <label htmlFor="signup-confirm" className={floatLabel}>Confirm password</label>
            <EyeButton shown={showConfirm} onClick={() => setShowConfirm(!showConfirm)} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl brand-gradient text-white font-semibold text-sm shadow-md shadow-violet-500/25 active:scale-[0.97] transition disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Creating account...
              </span>
            ) : 'Sign up'}
          </button>

          <p className="text-center text-xs text-gray-500 pt-2">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-semibold text-violet-600 hover:text-violet-700 active:scale-95 transition inline-block"
            >
              Sign in
            </button>
          </p>
        </form>

        <p className="text-[10px] text-gray-400 text-center mt-8">© 2026 PDT Softwares</p>
      </div>
    </div>
  );
}

export default SignUp;
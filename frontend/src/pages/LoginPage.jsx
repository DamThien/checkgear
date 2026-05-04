import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toaster from '../components/ui/Toast';
import { toast } from '../store/uiStore';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setGuest } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fn = mode === 'login' ? authApi.login : authApi.register;
      const res = await fn({ email, password });
      login(res.data.token, res.data.user);
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-accent)] opacity-[0.04] rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-600 opacity-[0.05] rounded-full blur-[60px]" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-sm px-4">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-accent)] mb-4 shadow-[0_0_30px_var(--color-accent-glow)]">
              <span className="text-white font-bold font-[var(--font-mono)] text-sm">CG</span>
            </div>
            <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)] tracking-tight">
              CheckGear
            </h1>
            <p className="text-[var(--color-faint)] text-sm mt-1">Track your tech. Monitor prices.</p>
          </div>

          {/* Card */}
          <div className="bg-[var(--color-panel)] border border-[var(--color-border2)] rounded-[var(--radius-xl)] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.5)] animate-fade-up" style={{ animationDelay: '60ms' }}>
            {/* Tabs */}
            <div className="flex bg-[var(--color-surface)] rounded-[var(--radius)] p-1 gap-1 mb-6">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 text-[13px] font-semibold rounded-[var(--radius-sm)] transition-all duration-200 capitalize ${
                    mode === m
                      ? 'bg-[var(--color-accent)] text-white shadow-sm'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="text-[10px] text-[var(--color-faint)] tracking-widest uppercase">or</span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>

            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => { setGuest(); navigate('/'); }}
            >
              Continue as Guest →
            </Button>
          </div>

          <p className="text-center text-[11px] text-[var(--color-faint)] mt-5" style={{ animationDelay: '120ms' }}>
            Guest mode: view market prices only
          </p>
        </div>
      </div>
      <Toaster />
    </>
  );
}

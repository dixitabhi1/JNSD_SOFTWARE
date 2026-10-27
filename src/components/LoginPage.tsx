import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS, DemoAccount } from '../context/AuthContext';
import {
  Shield,
  UserCheck,
  GraduationCap,
  AlertTriangle,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  School,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const [identifier, setIdentifier] = useState('manager@jnsd.edu');
  const [password, setPassword] = useState('Manager@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'demo'>('form');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await login(identifier, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (acc: DemoAccount) => {
    setIdentifier(acc.email);
    setPassword(acc.defaultPass);
    loginAsDemo(acc);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* School Crest */}
        <div className="inline-flex p-3 bg-white rounded-2xl shadow-md border border-slate-200 mb-3">
          <img src="/school-logo.png" alt="JNSD Education Centre Logo" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-2xl font-black text-school-900 tracking-tight">JNSD EDUCATION CENTRE</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
          School Management ERP • Session 2026–27
        </p>
        <p className="text-[11px] text-slate-400">Pre-Primary (Play Group) through Class 8 • Affiliation: CBSE-AFF-JNSD-0921</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          {/* Mode Selector Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition ${
                activeTab === 'form'
                  ? 'border-school-900 text-school-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Credentials Login
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'demo'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Role Switcher</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'form' ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Official Email or Staff ID</label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. manager@jnsd.edu or JNSD-TCH-101"
                    className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-600 focus:border-school-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[11px] text-school-600 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="block w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-600 focus:border-school-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center text-xs text-slate-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-school-800" />
                  <span className="ml-2 font-medium">Keep me signed in on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 border border-transparent rounded-xl shadow text-xs font-bold text-white bg-school-900 hover:bg-school-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-school-500 transition flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Select an authorized school role to sign in instantly with simulated credentials:
              </p>

              {DEMO_ACCOUNTS.map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectDemo(acc)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    acc.status === 'REVOKED'
                      ? 'border-rose-200 bg-rose-50/50 hover:bg-rose-50'
                      : acc.role === 'MANAGER'
                      ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50'
                      : acc.role === 'PRINCIPAL'
                      ? 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        acc.role === 'MANAGER'
                          ? 'bg-amber-100 text-amber-900'
                          : acc.role === 'PRINCIPAL'
                          ? 'bg-indigo-100 text-indigo-900'
                          : acc.status === 'REVOKED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-teal-100 text-teal-900'
                      }`}
                    >
                      {acc.role === 'MANAGER' && <Shield className="w-4 h-4" />}
                      {acc.role === 'PRINCIPAL' && <UserCheck className="w-4 h-4" />}
                      {acc.role === 'TEACHER' && acc.status === 'ACTIVE' && <GraduationCap className="w-4 h-4" />}
                      {acc.status === 'REVOKED' && <AlertTriangle className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{acc.label}</span>
                        {acc.status === 'REVOKED' ? (
                          <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded font-bold">
                            LOCKED
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold font-mono">
                            {acc.staffId}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{acc.description}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Protected by Row Level Security & AES-256 Cloud Authentication
          </div>
        </div>
      </div>
    </div>
  );
};

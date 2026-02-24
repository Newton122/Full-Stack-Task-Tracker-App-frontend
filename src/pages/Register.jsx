import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-dark via-brown-light to-brown-lighter flex items-center justify-center p-5 font-inter relative overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full animate-slide-up border border-white border-opacity-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent font-space-grotesk">
            Join Us
          </h1>
          <p className="text-gray-500 text-sm font-inter">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-brown-light mb-1.5 tracking-wider font-inter">USERNAME</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-3 py-3 border-2 border-gray-200 rounded-xl text-base font-inter bg-gray-50 transition-all duration-300 focus:border-gold focus:shadow-lg focus:bg-white"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-brown-light mb-1.5 tracking-wider font-inter">EMAIL</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-3 py-3 border-2 border-gray-200 rounded-xl text-base font-inter bg-gray-50 transition-all duration-300 focus:border-gold focus:shadow-lg focus:bg-white"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-brown-light mb-1.5 tracking-wider font-inter">PASSWORD</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-base font-inter bg-gray-50 transition-all duration-300 focus:border-gold focus:shadow-lg focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gold text-lg cursor-pointer hover:opacity-75 transition-opacity"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-brown-light mb-1.5 tracking-wider font-inter">CONFIRM PASSWORD</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-base font-inter bg-gray-50 transition-all duration-300 focus:border-gold focus:shadow-lg focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gold text-lg cursor-pointer hover:opacity-75 transition-opacity"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-900 text-xs p-2.5 rounded-lg flex items-center gap-2 animate-shake">
              ⚠️ {error}
            </div>
          )}

          <p className="text-xs text-gray-500 font-inter">💡 Press Ctrl+Enter to submit</p>

          <button
            type="submit"
            disabled={loading}
            className="py-3 bg-gradient-to-br from-gold to-gold-dark text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
          >
            {loading ? '🔄 Creating account...' : '✨ Create Account'}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600 text-sm font-inter">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-gold font-semibold cursor-pointer hover:text-gold-dark transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}

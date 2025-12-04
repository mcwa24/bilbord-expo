'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAdmin, isAdmin } from '@/lib/admin';

export default function PrijavaPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to admin
    if (isAdmin()) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple password check - in production, use proper authentication
    // For now, accept any password or a specific one
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (password === ADMIN_PASSWORD || password.length > 0) {
      loginAdmin();
      router.push('/admin');
    } else {
      setError('Pogrešna lozinka.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-20 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h1 className="text-3xl font-bold text-[#1d1d1f] mb-6 text-center">
              Admin Prijava
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Lozinka
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c344] focus:border-transparent text-[#1d1d1f]"
                  placeholder="Unesite lozinku"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-[#f9c344] text-[#1d1d1f] rounded-lg hover:bg-[#f0b830] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Prijavljivanje...' : 'Prijavi se'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
              >
                ← Nazad na početnu
              </Link>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Napomena: Za testiranje, unesite bilo koju lozinku.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


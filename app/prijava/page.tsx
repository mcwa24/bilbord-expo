'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { loginAdmin, isAdmin } from '@/lib/admin';

export default function PrijavaPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
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

    // Admin credentials
    const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'bilbord2024!';
    
    console.log('Login attempt:', { username, password, expectedUsername: ADMIN_USERNAME, expectedPassword: ADMIN_PASSWORD });
    
    // Trim whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    
    if (trimmedUsername === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
      loginAdmin();
      // Trigger storage event to update header
      window.dispatchEvent(new Event('storage'));
      router.push('/admin');
    } else {
      console.log('Login failed:', { 
        usernameMatch: trimmedUsername === ADMIN_USERNAME, 
        passwordMatch: trimmedPassword === ADMIN_PASSWORD,
        usernameLength: trimmedUsername.length,
        passwordLength: trimmedPassword.length
      });
      setError('Pogrešno korisničko ime ili lozinka.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex pt-20 pb-0">
      {/* Leva strana - Slika */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-[calc(100vh-80px)]">
        <Image
          src="/daniel-koponyas-p2DdFFvlFIU-unsplash_Bilbord_Portal.jpg"
          alt="Bilbord Portal"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Desna strana - Forma */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-[#1d1d1f] mb-2">
              Klijent
            </h1>
            <h2 className="text-3xl font-bold text-[#1d1d1f]">
              Prijava na sistem
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Korisničko ime
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-[#f9c344] focus:outline-none text-[#1d1d1f] transition"
                placeholder="Korisničko ime"
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Lozinka
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-[#f9c344] focus:outline-none text-[#1d1d1f] transition"
                placeholder="Lozinka"
                required
                disabled={loading}
                autoComplete="current-password"
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
              className="w-full px-6 py-3 bg-[#f9c344] hover:bg-[#f0b830] text-[#1d1d1f] font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Učitavanje...' : 'Nastavak'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline transition"
            >
              ← Nazad na početnu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isAdmin } from "@/lib/admin";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    setIsLoggedIn(isAdmin());
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      setIsLoggedIn(isAdmin());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on pathname change (when navigating)
    const interval = setInterval(() => {
      setIsLoggedIn(isAdmin());
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [pathname]);

  return (
    <header className={`w-full ${isAdminPage ? 'bg-white border-b border-gray-200' : 'bg-transparent absolute top-0 left-0 right-0'} z-50`}>
      <div className="w-full">
        <div className="w-full px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="https://bilbord.rs/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/FINAL LOGO BILBORD-06.png"
                alt="Bilbord Expo Logo"
                width={180}
                height={61}
                className="object-contain h-[40px] md:h-[45px] w-auto"
                quality={100}
                priority
                unoptimized
              />
            </Link>
          </div>

          <nav className="hidden xl:flex items-center gap-6 text-base md:text-lg relative">
            <Link
              href="https://bilbord.rs/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${pathname === "/" ? "underline font-semibold" : ""} text-[#1d1d1f] hover:underline transition`}
            >
              Naslovna
            </Link>
            <Link
              href="https://bilbord.rs/teme/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1d1d1f] hover:underline transition"
            >
              Teme
            </Link>
            <Link
              href="https://bilbord.rs/oglasavanje/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1d1d1f] hover:underline transition"
            >
              Oglašavanje
            </Link>
            <Link
              href="https://hub.bilbord.rs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1d1d1f] hover:underline transition"
            >
              PR Hub
            </Link>
            <Link
              href="https://bilbord.rs/kontakt/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1d1d1f] hover:underline transition"
            >
              Kontakt
            </Link>
            {isLoggedIn ? (
              <Link
                href="/admin"
                className="ml-2 px-8 py-4 rounded-full text-base font-medium text-[#1d1d1f] bg-[#f9c344] hover:bg-[#f0b830] transition"
              >
                Admin
              </Link>
            ) : (
              <Link
                href="/prijava"
                className="ml-2 px-8 py-4 rounded-full text-base font-medium text-[#1d1d1f] bg-[#f9c344] hover:bg-[#f0b830] transition"
              >
                Prijava
              </Link>
            )}
          </nav>

          <div className="xl:hidden z-50">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} className="text-[#1d1d1f]" /> : <Menu size={24} className="text-[#1d1d1f]" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="xl:hidden fixed inset-0 bg-black/20 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="xl:hidden fixed top-4 right-4 bg-black shadow-2xl z-50 rounded-lg w-auto"
              >
                <div className="p-6 pb-6 relative">
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded-full transition"
                    aria-label="Close menu"
                  >
                    <X size={24} className="text-white" />
                  </button>

                  <div className="space-y-0.5 mt-8 text-right">
                    <Link
                      href="https://bilbord.rs/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className={`${pathname === "/" ? "underline font-semibold" : ""} block text-white py-2 px-2 text-lg rounded-md hover:bg-gray-800 transition`}
                    >
                      Naslovna
                    </Link>
                    <Link
                      href="https://bilbord.rs/teme/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-white py-2 px-2 text-lg rounded-md hover:bg-gray-800 transition"
                    >
                      Teme
                    </Link>
                    <Link
                      href="https://bilbord.rs/oglasavanje/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-white py-2 px-2 text-lg rounded-md hover:bg-gray-800 transition"
                    >
                      Oglašavanje
                    </Link>
                    <Link
                      href="https://hub.bilbord.rs/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-white py-2 px-2 text-lg rounded-md hover:bg-gray-800 transition"
                    >
                      PR Hub
                    </Link>
                    <Link
                      href="https://bilbord.rs/kontakt/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-white py-2 px-2 text-lg rounded-md hover:bg-gray-800 transition"
                    >
                      Kontakt
                    </Link>
                    {isLoggedIn ? (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="block mt-4 px-8 py-3 bg-[#f9c344] hover:bg-[#f0b830] text-[#1d1d1f] font-medium rounded-full transition-colors duration-200 text-center"
                      >
                        Admin
                      </Link>
                    ) : (
                      <Link
                        href="/prijava"
                        onClick={() => setIsMenuOpen(false)}
                        className="block mt-4 px-8 py-3 bg-[#f9c344] hover:bg-[#f0b830] text-[#1d1d1f] font-medium rounded-full transition-colors duration-200 text-center"
                      >
                        Prijava
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}


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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const isAdminPage = pathname?.startsWith('/dashboard');
  const isLoginPage = pathname === '/prijava';

  useEffect(() => {
    setIsAdminLoggedIn(isAdmin());
  }, [pathname]);

  if (isLoginPage) {
    return null;
  }

  return (
    <header className={`w-full ${isAdminPage ? 'bg-white border-b border-gray-200' : 'bg-transparent absolute top-0 left-0 right-0'} z-50`}>
      <div className="w-full">
        <div className="w-full px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
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

          <nav className="hidden xl:flex items-center gap-6 text-sm md:text-base relative">
            {isAdminLoggedIn && (
              <Link
                href="/dashboard"
                className={`${pathname === "/dashboard" ? "underline font-semibold" : ""} text-[#1d1d1f] hover:underline transition`}
              >
                Admin
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
                className="xl:hidden fixed top-4 right-4 w-80 bg-white shadow-2xl z-50 rounded-2xl"
              >
                <div className="p-6 pb-6">
                  <div className="flex justify-end mb-6">
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                      aria-label="Close menu"
                    >
                      <X size={24} className="text-[#1d1d1f]" />
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      href="/"
                      onClick={() => setIsMenuOpen(false)}
                      className={`${pathname === "/" ? "underline font-semibold" : ""} block text-[#1d1d1f] py-2 px-2 text-base rounded-md hover:bg-gray-50 transition`}
                    >
                      Početna
                    </Link>
                    {isAdminLoggedIn && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className={`${pathname === "/dashboard" ? "underline font-semibold" : ""} block text-[#1d1d1f] py-2 px-2 text-base rounded-md hover:bg-gray-50 transition`}
                      >
                        Admin
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


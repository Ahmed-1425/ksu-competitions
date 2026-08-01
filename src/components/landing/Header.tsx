'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Header() {
  const { t, isRtl } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: t('nav.about') },
    { href: '#competitions', label: t('nav.competitions') },
    { href: '#steps', label: t('nav.howToParticipate') },
    { href: '#universities', label: t('nav.universities') },
    { href: '#faq', label: t('nav.faq') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-2 shadow-xs' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Main Header Brand Logo: Significantly Enlarged */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-64 sm:w-80 md:w-[380px] h-20 sm:h-24 transition-transform duration-200 group-hover:scale-102">
              <Image
                src="/brand/committee-logo.png"
                alt="شعار لجنة عمداء شؤون الطلاب للجامعات السعودية"
                fill
                className="object-contain object-right"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-[#2D3E36] hover:text-[#1F5A46] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <LanguageSwitcher />
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1F5A46] text-white text-sm font-bold hover:bg-[#174535] transition-all shadow-md active:scale-98"
            >
              <span>{t('nav.registerCta')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4 text-[#C9A96A]" /> : <ArrowRight className="w-4 h-4 text-[#C9A96A]" />}
            </Link>
          </div>

          {/* Mobile / Tablet Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#142921] bg-white border border-[#D7CFC1] hover:bg-[#F8F7F4] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-nav border-b border-[#D7CFC1] px-4 pt-4 pb-6 mt-3 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-bold text-[#2D3E36] hover:bg-[#F8F7F4] hover:text-[#1F5A46]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-[#D7CFC1] flex flex-col gap-3">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#1F5A46] text-white font-bold text-center shadow-md"
            >
              <span>{t('nav.registerCta')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4 text-[#C9A96A]" /> : <ArrowRight className="w-4 h-4 text-[#C9A96A]" />}
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-xs text-[#62776D] hover:text-[#1F5A46] py-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('nav.adminDashboard')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

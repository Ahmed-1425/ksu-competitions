'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileText,
  Camera,
  Compass,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  User,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('مدير النظام');

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setAdminEmail(user.email);
      }
    }
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { href: '/admin', label: 'نظرة عامة والتحليلات', icon: LayoutDashboard, exact: true },
    { href: '/admin/submissions', label: 'جميع المشاركات', icon: FileSpreadsheet, exact: true },
    { href: '/admin/submissions/report', label: 'أفضل تقرير', icon: FileText },
    { href: '/admin/submissions/photo', label: 'أفضل صورة', icon: Camera },
    { href: '/admin/submissions/passport', label: 'أفضل جواز سفر', icon: Compass },
    { href: '/admin/universities', label: 'إدارة الجامعات', icon: GraduationCap },
    { href: '/admin/settings', label: 'إعدادات النظام', icon: Settings },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-e border-[#D7CFC1] min-h-screen sticky top-0 h-screen z-30 justify-between p-5">
        <div className="space-y-6">
          {/* Dual Logos Sidebar Header: Enlarged */}
          <div className="px-1 pt-2 border-b border-[#D7CFC1]/60 pb-4">
            <Link href="/admin" className="block">
              <div className="flex items-center justify-between gap-2">
                <div className="relative w-28 h-12">
                  <Image
                    src="/brand/committee-logo.png"
                    alt="شعار لجنة عمداء شؤون الطلاب"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="w-[1.5px] h-8 bg-[#D7CFC1]" />
                <div className="relative w-28 h-12">
                  <Image
                    src="/universities/ksu.png"
                    alt="شعار جامعة الملك سعود"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1F5A46]/10 text-[#1F5A46] text-[11px] font-bold border border-[#C9A96A]/30 w-full justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A96A]" />
              <span>لوحة التحكم الإدارية</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-[#1F5A46] text-white shadow-xs'
                      : 'text-[#2D3E36] hover:bg-[#F8F7F4] hover:text-[#1F5A46]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C9A96A]' : ''}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile & Signout */}
        <div className="pt-4 border-t border-[#D7CFC1]/60 space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-full bg-[#1F5A46] text-[#C9A96A] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C9A96A]/40">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-[#142921] truncate">{adminEmail}</span>
              <span className="block text-[10px] text-[#62776D]">مسؤول مأذون</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-[11px] text-[#62776D] hover:text-[#1F5A46] font-bold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>الموقع العام</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-bold px-2.5 py-1 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden glass-nav sticky top-0 z-40 border-b border-[#D7CFC1] px-4 py-3 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="relative w-28 h-10">
            <Image src="/brand/committee-logo.png" alt="شعار اللجنة" fill className="object-contain" />
          </div>
          <div className="w-[1.5px] h-7 bg-[#D7CFC1]" />
          <div className="relative w-28 h-10">
            <Image src="/universities/ksu.png" alt="شعار جامعة الملك سعود" fill className="object-contain" />
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-xl text-[#142921] border border-[#D7CFC1]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto border-t border-[#D7CFC1]">
            <div className="flex items-center justify-between border-b border-[#D7CFC1] pb-4">
              <span className="font-bold text-sm text-[#142921]">قائمة لوحة التحكم</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg">
                <X className="w-6 h-6 text-[#62776D]" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${
                      isActive ? 'bg-[#1F5A46] text-white' : 'text-[#2D3E36] hover:bg-[#F8F7F4]'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#C9A96A]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#D7CFC1] flex items-center justify-between">
              <span className="text-xs text-[#62776D] truncate max-w-[180px]">{adminEmail}</span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 text-xs text-red-600 font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Breadcrumb Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#D7CFC1]">
          <div className="flex items-center gap-2 text-xs text-[#62776D]">
            <Link href="/admin" className="hover:text-[#1F5A46]">لوحة التحكم</Link>
            <span>/</span>
            <span className="font-bold text-[#142921]">
              {navItems.find((n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href)))?.label || 'الإدارة'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#1F5A46]/10 border border-[#C9A96A]/40 text-[#1F5A46] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              النظام متصل
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-grow">{children}</main>
      </div>
    </div>
  );
}

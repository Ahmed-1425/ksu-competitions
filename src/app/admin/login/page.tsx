'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw new Error(
          error.message === 'Invalid login credentials'
            ? 'اسم المستخدم أو كلمة المرور غير صحيحة'
            : error.message
        );
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile && profile.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('عذراً، هذا الحساب لا يملك صلاحيات مسؤول بالنظام (Admin Role).');
        }

        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع عند تسجيل الدخول';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#2D3E36]">
          البريد الإلكتروني للإدارة
        </label>
        <div className="relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ksu.edu.sa"
            dir="ltr"
            className="w-full px-4 py-3.5 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4]/50 text-[#142921] text-sm focus:bg-white focus:border-[#1F5A46]"
          />
          <Mail className="w-4 h-4 text-[#62776D] absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#2D3E36]">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-4 py-3.5 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4]/50 text-[#142921] text-sm focus:bg-white focus:border-[#1F5A46]"
          />
          <Lock className="w-4 h-4 text-[#62776D] absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-full bg-[#1F5A46] text-white font-bold text-sm hover:bg-[#174535] transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#C9A96A]" />
            <span>جاري التحقق من الاعتماد...</span>
          </>
        ) : (
          <span>تسجيل الدخول إلى اللوحة</span>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-ksu-mesh flex items-center justify-center p-4">
      <div className="max-w-xl w-full glass-card p-8 md:p-12 border border-[#D7CFC1] bg-white shadow-2xl space-y-8">
        {/* Significantly Enlarged Dual Logos Header */}
        <div className="text-center space-y-5">
          <div className="flex items-center justify-center gap-4 md:gap-6 mx-auto pb-2">
            <div className="relative w-44 sm:w-56 md:w-60 h-20 sm:h-24">
              <Image
                src="/brand/committee-logo.png"
                alt="شعار لجنة عمداء شؤون الطلاب"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="w-[2px] h-14 bg-[#D7CFC1]" />
            <div className="relative w-44 sm:w-56 md:w-60 h-20 sm:h-24">
              <Image
                src="/universities/ksu.png"
                alt="شعار جامعة الملك سعود"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1F5A46]/10 text-[#1F5A46] text-xs font-bold border border-[#C9A96A]/30">
            <ShieldCheck className="w-4 h-4 text-[#C9A96A]" />
            <span>بوابة الإدارة والنظام المحمي</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#142921]">تسجيل دخول المسؤولين</h1>
          <p className="text-xs sm:text-sm text-[#62776D]">
            يرجى إدخال بيانات الاعتماد المخصصة لإدارة منصة المسابقات
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#1F5A46]" />
          </div>
        }>
          <AdminLoginForm />
        </Suspense>

        <div className="pt-4 border-t border-[#D7CFC1] flex items-center justify-between text-xs text-[#62776D]">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-[#1F5A46] font-semibold">
            <ArrowLeft className="w-3.5 h-3.5 text-[#C9A96A]" />
            <span>العودة للمنصة العامة</span>
          </Link>
          <span className="text-[10px]">نظام محمي بـ Supabase Auth & RLS</span>
        </div>
      </div>
    </div>
  );
}

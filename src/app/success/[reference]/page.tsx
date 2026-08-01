'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { useI18n } from '@/lib/i18n/context';
import { CheckCircle2, Copy, Check, Home, ShieldCheck, FileCheck } from 'lucide-react';

interface SuccessPageProps {
  params: Promise<{ reference: string }>;
}

export default function SuccessPage({ params }: SuccessPageProps) {
  const { reference } = use(params);
  const { t, isRtl } = useI18n();
  const [copied, setCopied] = useState(false);

  const referenceCode = decodeURIComponent(reference || '');

  const handleCopy = () => {
    if (referenceCode) {
      navigator.clipboard.writeText(referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-ksu-mesh">
      <Header />
      <main className="flex-grow pt-36 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full text-center">
          <div className="glass-card p-8 md:p-12 border border-[#CDEAF5] bg-white shadow-2xl space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-[#CDEAF5]/80 text-[#008DC3] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1B2B]">
              {t('success.title')}
            </h1>

            <p className="text-sm text-[#5A6E7F]">
              تم تسجيل طلب مشاركتك في النظام وحفظه بنجاح تحت الحماية الكاملة.
            </p>

            {/* Reference Code Box */}
            <div className="p-6 rounded-2xl bg-[#F4FBFD] border border-[#008DC3]/30 space-y-3">
              <span className="text-xs font-bold text-[#5A6E7F] uppercase tracking-wider block">
                {t('success.referenceLabel')}
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#008DC3] tracking-widest">
                  {referenceCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-white border border-[#E2EEF5] text-[#008DC3] hover:bg-[#CDEAF5]/40 transition-all shadow-xs"
                  title={t('success.copyRef')}
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              {copied && <span className="text-xs font-semibold text-emerald-600">{t('success.copied')}</span>}
            </div>

            {/* Next steps instruction box */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2EEF5] text-start space-y-2">
              <h3 className="text-sm font-bold text-[#0B1B2B] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#008DC3]" />
                <span>{t('success.nextStepsTitle')}</span>
              </h3>
              <p className="text-xs text-[#2A3F55] leading-relaxed">
                {t('success.reportPhotoInstructions')}
              </p>
              <p className="text-xs text-[#5A6E7F] pt-1">
                تنبيه: احتفظ بالرقم المرجعي أعلاه في مكان آمن لاستخدامه عند استفسارك أو الاستعلام لدى المشرفين.
              </p>
            </div>

            {/* Return home CTA */}
            <div className="pt-4 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#008DC3] text-white font-bold text-sm hover:bg-[#0076A5] transition-all shadow-md"
              >
                <Home className="w-4 h-4" />
                <span>{t('success.backHome')}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

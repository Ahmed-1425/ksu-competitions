'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { AlertTriangle, Bell, Lock } from 'lucide-react';

interface NoticeBannerProps {
  registrationOpen: boolean;
  noticeText?: { ar?: string; en?: string };
}

export default function NoticeBanner({ registrationOpen, noticeText }: NoticeBannerProps) {
  const { isRtl } = useI18n();

  const customNotice = isRtl ? noticeText?.ar : (noticeText?.en || noticeText?.ar);

  if (registrationOpen && !customNotice) {
    return null;
  }

  return (
    <div
      className={`w-full py-2.5 px-4 text-center text-xs font-bold transition-all z-50 shadow-xs relative flex items-center justify-center gap-2 ${
        !registrationOpen
          ? 'bg-red-700 text-white'
          : 'bg-[#1F5A46] text-[#C9A96A] border-b border-[#C9A96A]/30'
      }`}
    >
      {!registrationOpen ? (
        <>
          <Lock className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
          <span>
            {customNotice
              ? `تنبيه: ${customNotice}`
              : 'تنبيه رسمي: تم إغلاق استقبال المشاركات في مسابقات هذا الموسم حالياً.'}
          </span>
        </>
      ) : (
        <>
          <Bell className="w-4 h-4 text-[#C9A96A] shrink-0" />
          <span>📢 تنبيه: {customNotice}</span>
        </>
      )}
    </div>
  );
}

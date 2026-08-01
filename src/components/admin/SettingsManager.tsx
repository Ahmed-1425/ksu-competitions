'use client';

import React, { useState } from 'react';
import { Save, CheckCircle, ToggleLeft, ToggleRight, Loader2, Bell, AlertTriangle } from 'lucide-react';

interface SettingsManagerProps {
  registrationOpen: boolean;
  noticeText: { ar: string; en: string };
}

export default function SettingsManager({
  registrationOpen: initialOpen,
  noticeText: initialNotice,
}: SettingsManagerProps) {
  const [registrationOpen, setRegistrationOpen] = useState(initialOpen);
  const [noticeAr, setNoticeAr] = useState(initialNotice?.ar || '');
  const [noticeEn, setNoticeEn] = useState(initialNotice?.en || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_open: registrationOpen,
          notice_ar: noticeAr,
          notice_en: noticeEn,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'فشل حفظ الإعدادات');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الحفظ';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-[#D7CFC1] pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#142921]">إعدادات النظام العامة</h1>
        <p className="text-xs sm:text-sm text-[#62776D] mt-1">
          التحكم الفوري في تفعيل أو إغلاق التسجيل بالموقع ونشر شريط التنبيهات العام
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>تم حفظ الإعدادات وتحديث حالة الموقع فوراً!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 border border-[#D7CFC1] bg-white space-y-6 shadow-md">
        {/* Registration Toggle Box */}
        <div className="p-5 rounded-2xl bg-[#F8F7F4] border border-[#D7CFC1] space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-[#142921] text-base">حالة فترة التسجيل والمشاركة بالموقع</h3>
              <p className="text-xs text-[#62776D] mt-1">
                عند تحويل الحالة إلى (مغلق حالياً)، يظهر تنبيه إغلاق التسجيل فوراً بجميع صفحات الموقع ويُحظر إرسال أي مشاركات جديدة.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRegistrationOpen(!registrationOpen)}
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all shadow-xs shrink-0 ${
                registrationOpen
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
              }`}
            >
              {registrationOpen ? (
                <>
                  <ToggleRight className="w-6 h-6 text-emerald-600" />
                  <span>مفتوح للجميع</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-6 h-6 text-red-600" />
                  <span>مغلق حالياً</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-[#D7CFC1]/60 flex items-center gap-2 text-xs font-semibold">
            <span>الحالة الحالية المختارة:</span>
            {registrationOpen ? (
              <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full font-bold">
                ✓ التقديم مفتوح ومتاح للطلاب والجامعات
              </span>
            ) : (
              <span className="text-red-700 bg-red-100 px-3 py-1 rounded-full font-bold">
                🚫 التقديم مغلق ومحظور بالفرونت إند
              </span>
            )}
          </div>
        </div>

        {/* Notice text fields */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-[#142921] text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#1F5A46]" />
            <span>نص الشريط التنبيهي البارز في أعلى الموقع (اختياري)</span>
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#2D3E36]">
              نص التنبيه بالعربية:
            </label>
            <input
              type="text"
              value={noticeAr}
              onChange={(e) => setNoticeAr(e.target.value)}
              placeholder="مثال: ينتهي التسجيل في مسابقات هذا الموسم بانتهاء الشهر الحالي..."
              className="w-full px-4 py-3 rounded-xl border border-[#D7CFC1] text-xs text-[#142921] focus:border-[#1F5A46] bg-[#F8F7F4]/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#2D3E36]">
              نص التنبيه بالإنجليزية:
            </label>
            <input
              type="text"
              value={noticeEn}
              onChange={(e) => setNoticeEn(e.target.value)}
              placeholder="Notice: Submissions close soon..."
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl border border-[#D7CFC1] text-xs text-[#142921] focus:border-[#1F5A46] bg-[#F8F7F4]/40"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#D7CFC1] flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1F5A46] text-white font-bold text-xs hover:bg-[#174535] transition-all shadow-md disabled:opacity-50 active:scale-98"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#C9A96A]" />
                <span>جاري حفظ التغييرات وتحديث الموقع...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#C9A96A]" />
                <span>حفظ التغييرات والنشر الآن</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

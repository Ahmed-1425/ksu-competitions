'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { CompetitionType, University } from '@/types/database';
import { driveUrlRegex } from '@/lib/validation/submission';
import {
  FileText,
  Camera,
  Compass,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Building2,
  User,
  Phone,
  Link2,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

interface RegistrationFormProps {
  initialUniversities: University[];
}

export default function RegistrationForm({ initialUniversities }: RegistrationFormProps) {
  const { t, isRtl } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const preselectedCompetition = (searchParams.get('competition') as CompetitionType) || 'report';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [universityId, setUniversityId] = useState<string>('');
  const [universityOtherName, setUniversityOtherName] = useState('');

  const [competitionType, setCompetitionType] = useState<CompetitionType>(
    ['report', 'photo', 'passport'].includes(preselectedCompetition) ? preselectedCompetition : 'report'
  );
  const [driveUrl, setDriveUrl] = useState('');
  const [submitterRole, setSubmitterRole] = useState('');
  const [photoSingleConfirmed, setPhotoSingleConfirmed] = useState(false);
  const [passportDelivered, setPassportDelivered] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Field Level Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const compParam = searchParams.get('competition') as CompetitionType;
    if (compParam && ['report', 'photo', 'passport'].includes(compParam)) {
      setCompetitionType(compParam);
    }
  }, [searchParams]);

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'الاسم الكامل مطلوب (حرفين على الأقل)';
    } else if (fullName.trim().length > 120) {
      newErrors.fullName = 'الاسم يتجاوز 120 حرفاً';
    }

    if (!phone.trim() || phone.trim().length < 7) {
      newErrors.phone = 'رقم الجوال مطلوب لتواصل الإدارة';
    }

    if (!universityId) {
      newErrors.universityId = 'يرجى اختيار الجامعة المشاركة';
    } else if (universityId === 'other' && (!universityOtherName.trim() || universityOtherName.trim().length < 2)) {
      newErrors.universityOtherName = 'يرجى كتابة اسم الجامعة الأخرى';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (competitionType === 'report' || competitionType === 'photo') {
      if (!driveUrl.trim()) {
        newErrors.driveUrl = 'رابط Google Drive مطلوب لهذه الفئة';
      } else if (!driveUrlRegex.test(driveUrl.trim())) {
        newErrors.driveUrl = 'يرجى إدخال رابط Google Drive صالح (مثال: https://drive.google.com/...)';
      }
    }

    if (competitionType === 'photo' && !photoSingleConfirmed) {
      newErrors.photoSingleConfirmed = 'يجب الإقرار بأن الرابط يحتوي صورة واحدة فقط';
    }

    if (competitionType === 'passport' && !passportDelivered) {
      newErrors.passportDelivered = 'يجب الإقرار بتسليم الجواز يدويًا مع كتابة اسمك عليه';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    setErrorMessage(null);
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setErrors({});
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!termsAccepted) {
      setErrors({ termsAccepted: 'يجب الموافقة على الشروط وأحكام المسابقة قبل الإرسال' });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        full_name: fullName,
        phone,
        university_id: universityId,
        university_other_name: universityId === 'other' ? universityOtherName : null,
        competition_type: competitionType,
        drive_url: (competitionType === 'report' || competitionType === 'photo') ? driveUrl : null,
        submitter_role: submitterRole || null,
        photo_single_item_confirmed: competitionType === 'photo' ? photoSingleConfirmed : false,
        passport_delivered: competitionType === 'passport' ? passportDelivered : false,
        terms_accepted: termsAccepted,
        honeypot,
      };

      const res = await fetch('/api/public/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'حدث خطأ في الإرسال');
      }

      router.push(`/success/${encodeURIComponent(result.reference_code)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء إرسال المشاركة';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#D7CFC1] -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 right-0 h-1 bg-[#1F5A46] -translate-y-1/2 z-0 transition-all duration-300"
            style={{
              width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
              left: isRtl ? 'auto' : 0,
              right: isRtl ? 0 : 'auto',
            }}
          />

          {/* Step 1 Pill */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border ${
                step >= 1 ? 'bg-[#1F5A46] text-[#C9A96A] border-[#C9A96A]/40 shadow-md' : 'bg-[#D7CFC1] text-[#62776D] border-transparent'
              }`}
            >
              1
            </div>
            <span className="text-xs font-bold text-[#142921] mt-2">{t('form.step1')}</span>
          </div>

          {/* Step 2 Pill */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border ${
                step >= 2 ? 'bg-[#1F5A46] text-[#C9A96A] border-[#C9A96A]/40 shadow-md' : 'bg-[#D7CFC1] text-[#62776D] border-transparent'
              }`}
            >
              2
            </div>
            <span className="text-xs font-bold text-[#142921] mt-2">{t('form.step2')}</span>
          </div>

          {/* Step 3 Pill */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border ${
                step >= 3 ? 'bg-[#1F5A46] text-[#C9A96A] border-[#C9A96A]/40 shadow-md' : 'bg-[#D7CFC1] text-[#62776D] border-transparent'
              }`}
            >
              3
            </div>
            <span className="text-xs font-bold text-[#142921] mt-2">{t('form.step3')}</span>
          </div>
        </div>
      </div>

      {/* Main Glass Form Container */}
      <div className="glass-card p-6 md:p-10 border border-[#D7CFC1] bg-white shadow-xl">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="text"
            name="website_url_hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-[#D7CFC1] pb-4">
                <h3 className="text-xl font-bold text-[#142921] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#1F5A46]" />
                  <span>{t('form.step1')}</span>
                </h3>
                <p className="text-xs text-[#62776D] mt-1">أدخل بياناتك الشخصية للتحقق والتواصل</p>
              </div>

              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#2D3E36]">
                  {t('form.fullName')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: عبد الله بن محمد العتيبي"
                    className={`w-full px-4 py-3 rounded-xl border bg-[#F8F7F4]/50 text-[#142921] text-sm focus:bg-white transition-all ${
                      errors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-[#D7CFC1] focus:border-[#1F5A46]'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#2D3E36]">
                  {t('form.phone')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xxxxxxx / +9665xxxxxxxx"
                    dir="ltr"
                    className={`w-full px-4 py-3 rounded-xl border bg-[#F8F7F4]/50 text-[#142921] text-sm focus:bg-white transition-all text-end ${
                      errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-[#D7CFC1] focus:border-[#1F5A46]'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-[#62776D] absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* University Select */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#2D3E36]">
                  {t('form.university')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-[#F8F7F4]/50 text-[#142921] text-sm focus:bg-white transition-all ${
                      errors.universityId ? 'border-red-400' : 'border-[#D7CFC1] focus:border-[#1F5A46]'
                    }`}
                  >
                    <option value="">{t('form.selectUniversity')}</option>
                    {initialUniversities.map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {isRtl ? uni.name_ar : uni.name_en || uni.name_ar}
                      </option>
                    ))}
                    <option value="other">أخرى (غير مدرجة بالقائمة)</option>
                  </select>
                </div>
                {errors.universityId && <p className="text-xs text-red-500">{errors.universityId}</p>}
              </div>

              {/* Other University Name */}
              {universityId === 'other' && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <label className="block text-sm font-semibold text-[#2D3E36]">
                    {t('form.otherUniversity')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={universityOtherName}
                    onChange={(e) => setUniversityOtherName(e.target.value)}
                    placeholder="اكتب اسم جامعتك كاملًا..."
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-[#142921] text-sm focus:border-[#1F5A46] ${
                      errors.universityOtherName ? 'border-red-400' : 'border-[#D7CFC1]'
                    }`}
                  />
                  {errors.universityOtherName && (
                    <p className="text-xs text-red-500">{errors.universityOtherName}</p>
                  )}
                </div>
              )}

              {/* Action */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1F5A46] text-white font-bold text-sm hover:bg-[#174535] transition-all shadow-md"
                >
                  <span>{t('form.next')}</span>
                  {isRtl ? <ChevronLeft className="w-4 h-4 text-[#C9A96A]" /> : <ChevronRight className="w-4 h-4 text-[#C9A96A]" />}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Competition Selection & Requirements */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-[#D7CFC1] pb-4">
                <h3 className="text-xl font-bold text-[#142921] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C9A96A]" />
                  <span>{t('form.step2')}</span>
                </h3>
                <p className="text-xs text-[#62776D] mt-1">اختر المسابقة واطلع على الشروط الإلزامية</p>
              </div>

              {/* Competition Radio Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Report Radio */}
                <label
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    competitionType === 'report'
                      ? 'border-[#1F5A46] bg-[#F8F7F4] ring-2 ring-[#C9A96A]/30 shadow-xs'
                      : 'border-[#D7CFC1] bg-white hover:border-[#1F5A46]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="w-6 h-6 text-[#1F5A46]" />
                    <input
                      type="radio"
                      name="comp_select"
                      value="report"
                      checked={competitionType === 'report'}
                      onChange={() => setCompetitionType('report')}
                      className="accent-[#1F5A46] w-4 h-4"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#142921] text-base">{t('competitions.report.title')}</h4>
                    <p className="text-xs text-[#62776D] mt-1">{t('competitions.report.tagline')}</p>
                  </div>
                </label>

                {/* Photo Radio */}
                <label
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    competitionType === 'photo'
                      ? 'border-[#1F5A46] bg-[#F8F7F4] ring-2 ring-[#C9A96A]/30 shadow-xs'
                      : 'border-[#D7CFC1] bg-white hover:border-[#1F5A46]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Camera className="w-6 h-6 text-[#1F5A46]" />
                    <input
                      type="radio"
                      name="comp_select"
                      value="photo"
                      checked={competitionType === 'photo'}
                      onChange={() => setCompetitionType('photo')}
                      className="accent-[#1F5A46] w-4 h-4"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#142921] text-base">{t('competitions.photo.title')}</h4>
                    <p className="text-xs text-[#62776D] mt-1">{t('competitions.photo.tagline')}</p>
                  </div>
                </label>

                {/* Passport Radio */}
                <label
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    competitionType === 'passport'
                      ? 'border-[#1F5A46] bg-[#F8F7F4] ring-2 ring-[#C9A96A]/30 shadow-xs'
                      : 'border-[#D7CFC1] bg-white hover:border-[#1F5A46]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Compass className="w-6 h-6 text-[#1F5A46]" />
                    <input
                      type="radio"
                      name="comp_select"
                      value="passport"
                      checked={competitionType === 'passport'}
                      onChange={() => setCompetitionType('passport')}
                      className="accent-[#1F5A46] w-4 h-4"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#142921] text-base">{t('competitions.passport.title')}</h4>
                    <p className="text-xs text-[#62776D] mt-1">{t('competitions.passport.tagline')}</p>
                  </div>
                </label>
              </div>

              {/* Dynamic Warning Alert per track */}
              {competitionType === 'report' && (
                <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#D7CFC1] text-[#142921] text-xs leading-relaxed flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#1F5A46] shrink-0 mt-0.5" />
                  <span>{t('form.reportWarning')}</span>
                </div>
              )}

              {competitionType === 'photo' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{t('form.photoWarning')}</span>
                </div>
              )}

              {competitionType === 'passport' && (
                <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#D7CFC1] text-[#142921] text-xs leading-relaxed flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#1F5A46] shrink-0 mt-0.5" />
                  <span>{t('form.passportWarning')}</span>
                </div>
              )}

              {/* Track Requirements Inputs */}
              {(competitionType === 'report' || competitionType === 'photo') && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#2D3E36]">
                      {t('form.driveUrl')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={driveUrl}
                        onChange={(e) => setDriveUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/..."
                        dir="ltr"
                        className={`w-full px-4 py-3 rounded-xl border bg-[#F8F7F4]/50 text-[#142921] text-sm focus:bg-white ${
                          errors.driveUrl ? 'border-red-400' : 'border-[#D7CFC1] focus:border-[#1F5A46]'
                        }`}
                      />
                      <Link2 className="w-4 h-4 text-[#62776D] absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.driveUrl && <p className="text-xs text-red-500">{errors.driveUrl}</p>}
                  </div>

                  {competitionType === 'report' && (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-[#2D3E36]">
                        {t('form.submitterRole')} <span className="text-xs font-normal text-[#62776D]">(اختياري)</span>
                      </label>
                      <input
                        type="text"
                        value={submitterRole}
                        onChange={(e) => setSubmitterRole(e.target.value)}
                        placeholder="مثال: مشرف الأنشطة / رئيس النادي الطلابي"
                        className="w-full px-4 py-3 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4]/50 text-[#142921] text-sm focus:border-[#1F5A46]"
                      />
                    </div>
                  )}

                  {competitionType === 'photo' && (
                    <div className="pt-2">
                      <label className="flex items-start gap-3 p-4 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={photoSingleConfirmed}
                          onChange={(e) => setPhotoSingleConfirmed(e.target.checked)}
                          className="accent-[#1F5A46] w-5 h-5 mt-0.5 shrink-0"
                        />
                        <span className="text-xs font-bold text-[#142921] leading-relaxed">
                          {t('form.confirmSinglePhoto')} <span className="text-red-500">*</span>
                        </span>
                      </label>
                      {errors.photoSingleConfirmed && (
                        <p className="text-xs text-red-500 mt-1">{errors.photoSingleConfirmed}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {competitionType === 'passport' && (
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={passportDelivered}
                      onChange={(e) => setPassportDelivered(e.target.checked)}
                      className="accent-[#1F5A46] w-5 h-5 mt-0.5 shrink-0"
                    />
                    <span className="text-xs font-bold text-[#142921] leading-relaxed">
                      {t('form.confirmPassportDelivered')} <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.passportDelivered && (
                    <p className="text-xs text-red-500 mt-1">{errors.passportDelivered}</p>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D7CFC1] text-[#2D3E36] font-semibold text-sm hover:bg-[#F8F7F4]"
                >
                  {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  <span>{t('form.back')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1F5A46] text-white font-bold text-sm hover:bg-[#174535] transition-all shadow-md"
                >
                  <span>{t('form.next')}</span>
                  {isRtl ? <ChevronLeft className="w-4 h-4 text-[#C9A96A]" /> : <ChevronRight className="w-4 h-4 text-[#C9A96A]" />}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-[#D7CFC1] pb-4">
                <h3 className="text-xl font-bold text-[#142921] flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#1F5A46]" />
                  <span>{t('form.step3')}</span>
                </h3>
                <p className="text-xs text-[#62776D] mt-1">راجع صحة مدخلاتك واقرّ بالشروط للتأكيد</p>
              </div>

              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-[#F8F7F4] border border-[#D7CFC1] space-y-4 text-sm text-[#142921]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-[#62776D] block">الاسم الكامل:</span>
                    <span className="font-bold">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#62776D] block">رقم الجوال:</span>
                    <span className="font-bold" dir="ltr">{phone}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#62776D] block">الجامعة:</span>
                    <span className="font-bold">
                      {universityId === 'other'
                        ? universityOtherName
                        : initialUniversities.find((u) => u.id === universityId)?.name_ar}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#62776D] block">المسابقة:</span>
                    <span className="font-bold text-[#1F5A46]">
                      {competitionType === 'report' && 'أفضل تقرير'}
                      {competitionType === 'photo' && 'أفضل صورة فوتوغرافية'}
                      {competitionType === 'passport' && 'أفضل جواز سفر'}
                    </span>
                  </div>
                </div>

                {driveUrl && (
                  <div className="pt-2 border-t border-[#D7CFC1]">
                    <span className="text-xs font-semibold text-[#62776D] block">رابط المشاركة (Google Drive):</span>
                    <a
                      href={driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#1F5A46] underline font-mono break-all"
                    >
                      {driveUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* Terms Acceptance Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-4 rounded-xl border border-[#D7CFC1] bg-white cursor-pointer hover:border-[#1F5A46] transition-colors">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="accent-[#1F5A46] w-5 h-5 mt-0.5 shrink-0"
                  />
                  <span className="text-xs font-semibold text-[#2D3E36] leading-relaxed">
                    {t('form.acceptTerms')} <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.termsAccepted && <p className="text-xs text-red-500 mt-1">{errors.termsAccepted}</p>}
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D7CFC1] text-[#2D3E36] font-semibold text-sm hover:bg-[#F8F7F4] disabled:opacity-50"
                >
                  {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  <span>{t('form.back')}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#1F5A46] text-white font-bold text-base hover:bg-[#174535] transition-all shadow-lg hover:shadow-xl active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t('form.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#C9A96A]" />
                      <span>{t('form.submitButton')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

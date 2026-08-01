'use client';

import React, { useState } from 'react';
import { University } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import {
  GraduationCap,
  Plus,
  Edit2,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';

interface UniversitiesManagerProps {
  initialUniversities: University[];
}

export default function UniversitiesManager({ initialUniversities }: UniversitiesManagerProps) {
  const [universities, setUniversities] = useState<University[]>(initialUniversities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState<University | null>(null);

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setEditingUni(null);
    setNameAr('');
    setNameEn('');
    setSlug('');
    setSortOrder(universities.length + 1);
    setIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (uni: University) => {
    setEditingUni(uni);
    setNameAr(uni.name_ar);
    setNameEn(uni.name_en || '');
    setSlug(uni.slug);
    setSortOrder(uni.sort_order);
    setIsActive(uni.is_active);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (uni: University) => {
    try {
      const supabase = createClient();
      const updatedStatus = !uni.is_active;

      const { error } = await supabase
        .from('universities')
        .update({ is_active: updatedStatus })
        .eq('id', uni.id);

      if (error) throw error;

      setUniversities((prev) =>
        prev.map((u) => (u.id === uni.id ? { ...u, is_active: updatedStatus } : u))
      );
    } catch {
      alert('حدث خطأ أثناء تغيير حالة الجامعة');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !slug.trim()) {
      setErrorMessage('الاسم بالعربية والـ Slug حقلان مطلوبان');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();

      if (editingUni) {
        const { data, error } = await supabase
          .from('universities')
          .update({
            name_ar: nameAr.trim(),
            name_en: nameEn.trim() || null,
            slug: slug.trim().toLowerCase(),
            sort_order: sortOrder,
            is_active: isActive,
          })
          .eq('id', editingUni.id)
          .select('*')
          .single();

        if (error) throw error;

        setUniversities((prev) =>
          prev.map((u) => (u.id === editingUni.id ? (data as University) : u))
        );
      } else {
        const { data, error } = await supabase
          .from('universities')
          .insert([
            {
              name_ar: nameAr.trim(),
              name_en: nameEn.trim() || null,
              slug: slug.trim().toLowerCase(),
              sort_order: sortOrder,
              is_active: isActive,
            },
          ])
          .select('*')
          .single();

        if (error) throw error;

        setUniversities((prev) => [...prev, data as University]);
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D7CFC1] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#142921]">إدارة الجامعات المشاركة</h1>
          <p className="text-xs sm:text-sm text-[#62776D] mt-1">
            إضافة وتعديل وتعطيل الجامعات التي تظهر في نموذج التسجيل
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1F5A46] text-white text-xs font-bold hover:bg-[#174535] transition-all shadow-md active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C9A96A]" />
          <span>إضافة جامعة جديدة</span>
        </button>
      </div>

      {/* Universities Table */}
      <div className="glass-card border border-[#D7CFC1] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#D7CFC1] text-[#62776D] bg-[#F8F7F4]">
                <th className="p-3 text-start w-16">الترتيب</th>
                <th className="p-3 text-start">الاسم بالعربية</th>
                <th className="p-3 text-start">الاسم بالإنجليزية</th>
                <th className="p-3 text-start">الرمز (Slug)</th>
                <th className="p-3 text-start">الحالة</th>
                <th className="p-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7CFC1]/60">
              {universities
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((uni) => (
                  <tr key={uni.id} className="hover:bg-[#F8F7F4]/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#1F5A46]">{uni.sort_order}</td>
                    <td className="p-3 font-bold text-[#142921]">{uni.name_ar}</td>
                    <td className="p-3 text-[#2D3E36]">{uni.name_en || '-'}</td>
                    <td className="p-3 font-mono text-[#62776D]">{uni.slug}</td>
                    <td className="p-3">
                      {uni.is_active ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>نشطة</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-gray-500" />
                          <span>معطلة</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(uni)}
                          className="p-1.5 rounded-lg text-[#1F5A46] hover:bg-[#1F5A46]/10 transition-colors"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(uni)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                            uni.is_active
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {uni.is_active ? 'تعطيل' : 'تفعيل'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit University Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-card p-6 md:p-8 max-w-lg w-full bg-white border border-[#D7CFC1] shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#D7CFC1] pb-4">
              <h3 className="text-lg font-bold text-[#142921] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#1F5A46]" />
                <span>{editingUni ? 'تعديل بيانات الجامعة' : 'إضافة جامعة جديدة'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#62776D] hover:text-[#142921]"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                {errorMessage}
              </p>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#2D3E36]">
                  الاسم بالعربية <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: جامعة الملك سعود"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CFC1] text-sm text-[#142921] focus:border-[#1F5A46]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#2D3E36]">الاسم بالإنجليزية</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="King Saud University"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CFC1] text-sm text-[#142921] focus:border-[#1F5A46]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#2D3E36]">
                    الرمز (Slug) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ksu"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CFC1] text-sm font-mono text-[#142921] focus:border-[#1F5A46]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#2D3E36]">ترتيب الظهور</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    min={1}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7CFC1] text-sm text-[#142921] focus:border-[#1F5A46]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-[#1F5A46] w-4 h-4"
                  />
                  <span className="font-semibold text-[#2D3E36]">جامعة نشطة في المنصة</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D7CFC1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#D7CFC1] text-[#2D3E36] font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#1F5A46] hover:bg-[#174535] text-white font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{editingUni ? 'حفظ التعديلات' : 'إضافة الجامعة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

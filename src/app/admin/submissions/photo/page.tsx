import React from 'react';
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import { createAdminClient } from '@/lib/supabase/admin';
import { Submission, University } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData() {
  try {
    const supabase = createAdminClient();

    const [submissionsRes, universitiesRes] = await Promise.all([
      supabase
        .from('submissions')
        .select('*, university:universities(*)')
        .eq('competition_type', 'photo')
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
      supabase
        .from('universities')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ]);

    return {
      submissions: (submissionsRes.data || []) as Submission[],
      universities: (universitiesRes.data || []) as University[],
    };
  } catch (err) {
    console.error('Error fetching photo submissions:', err);
    return { submissions: [], universities: [] };
  }
}

export default async function AdminPhotoSubmissionsPage() {
  const { submissions, universities } = await getData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#142921]">مشاركات مسار: أفضل صورة فوتوغرافية</h1>
        <p className="text-xs sm:text-sm text-[#62776D] mt-1">
          عاين واستعرض الصور الفوتوغرافية المقدمة من طلاب الجامعات المشاركة
        </p>
      </div>

      <SubmissionsTable
        initialSubmissions={submissions}
        universities={universities}
        forcedCompetitionType="photo"
      />
    </div>
  );
}

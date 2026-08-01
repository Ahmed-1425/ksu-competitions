import React from 'react';
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import { createAdminClient } from '@/lib/supabase/admin';
import { Submission, University } from '@/types/database';

async function getData() {
  try {
    const supabase = createAdminClient();

    const [submissionsRes, universitiesRes] = await Promise.all([
      supabase
        .from('submissions')
        .select('*, university:universities(*)')
        .eq('competition_type', 'report')
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
  } catch {
    return { submissions: [], universities: [] };
  }
}

export default async function AdminReportSubmissionsPage() {
  const { submissions, universities } = await getData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1B2B]">مشاركات مسابقة أفضل تقرير</h1>
        <p className="text-xs sm:text-sm text-[#5A6E7F] mt-1">
          قائمة التقارير المستلمة باسم الجامعات المشاركة
        </p>
      </div>

      <SubmissionsTable
        initialSubmissions={submissions}
        universities={universities}
        forcedCompetitionType="report"
      />
    </div>
  );
}

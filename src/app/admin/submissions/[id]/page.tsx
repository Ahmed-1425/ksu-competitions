import React from 'react';
import { notFound } from 'next/navigation';
import SubmissionDetailView from '@/components/admin/SubmissionDetailView';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { Submission, SubmissionActivity } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getSubmissionDetail(id: string) {
  try {
    const supabase = createAdminClient();

    const [subRes, logsRes] = await Promise.all([
      supabase
        .from('submissions')
        .select('*, university:universities(*)')
        .eq('id', id)
        .is('deleted_at', null)
        .single(),
      supabase
        .from('submission_activity')
        .select('*')
        .eq('submission_id', id)
        .order('created_at', { ascending: false }),
    ]);

    if (subRes.error || !subRes.data) {
      return null;
    }

    return {
      submission: subRes.data as Submission,
      activityLogs: (logsRes.data || []) as SubmissionActivity[],
    };
  } catch {
    return null;
  }
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const detail = await getSubmissionDetail(id);

  if (!detail) {
    notFound();
  }

  const supabaseServer = await createClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  const currentUserId = user?.id || 'admin-system';

  return (
    <SubmissionDetailView
      submission={detail.submission}
      activityLogs={detail.activityLogs}
      currentUserId={currentUserId}
    />
  );
}

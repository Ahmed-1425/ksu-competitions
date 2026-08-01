import React from 'react';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import SubmissionDetailView from '@/components/admin/SubmissionDetailView';
import { Submission, SubmissionActivity } from '@/types/database';

interface SingleSubmissionPageProps {
  params: Promise<{ id: string }>;
}

async function getSubmissionData(id: string) {
  try {
    const supabase = createAdminClient();

    const [subRes, activityRes] = await Promise.all([
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
      activityLogs: (activityRes.data || []) as SubmissionActivity[],
    };
  } catch (err) {
    console.error('Error fetching single submission data:', err);
    return null;
  }
}

export default async function SingleSubmissionPage({ params }: SingleSubmissionPageProps) {
  const { id } = await params;
  const data = await getSubmissionData(id);

  if (!data) {
    notFound();
  }

  const serverSupabase = await createClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  return (
    <SubmissionDetailView
      submission={data.submission}
      activityLogs={data.activityLogs}
      currentUserId={user?.id || ''}
    />
  );
}

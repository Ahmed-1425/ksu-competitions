import React from 'react';
import UniversitiesManager from '@/components/admin/UniversitiesManager';
import { createAdminClient } from '@/lib/supabase/admin';
import { University } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getUniversities() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data as University[];
  } catch {
    return [];
  }
}

export default async function AdminUniversitiesPage() {
  const universities = await getUniversities();

  return <UniversitiesManager initialUniversities={universities} />;
}

import React from 'react';
import SettingsManager from '@/components/admin/SettingsManager';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getSettings() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('app_settings').select('*');

    let registrationOpen = true;
    let noticeText = { ar: '', en: '' };

    if (data) {
      data.forEach((item) => {
        if (item.key === 'registration_open') {
          registrationOpen = item.value === true || item.value === 'true' || JSON.stringify(item.value) === 'true';
        }
        if (item.key === 'notice_text' && typeof item.value === 'object' && item.value !== null) {
          noticeText = item.value as { ar: string; en: string };
        }
      });
    }

    return { registrationOpen, noticeText };
  } catch {
    return { registrationOpen: true, noticeText: { ar: '', en: '' } };
  }
}

export default async function AdminSettingsPage() {
  const { registrationOpen, noticeText } = await getSettings();

  return <SettingsManager registrationOpen={registrationOpen} noticeText={noticeText} />;
}

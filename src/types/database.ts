export type AppRole = 'admin' | 'viewer';
export type CompetitionType = 'report' | 'photo' | 'passport';
export type SubmissionStatus =
  | 'new'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'completed'
  | 'pending_receipt'
  | 'received';

export interface Profile {
  id: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
}

export interface University {
  id: string;
  name_ar: string;
  name_en: string | null;
  slug: string;
  logo_path: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  reference_code: string;
  full_name: string;
  phone: string;
  university_id: string | null;
  university_other_name: string | null;
  competition_type: CompetitionType;
  drive_url: string | null;
  submitter_role: string | null;
  passport_delivered: boolean;
  terms_accepted_at: string;
  photo_single_item_confirmed: boolean;
  read_at: string | null;
  read_by: string | null;
  status: SubmissionStatus;
  receipt_confirmed_at: string | null;
  receipt_confirmed_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Joined relation fields
  university?: University | null;
}

export interface SubmissionActivity {
  id: string;
  submission_id: string;
  actor_id: string | null;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
  actor_profile?: Profile | null;
}

export interface AppSettings {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
  updated_by: string | null;
}

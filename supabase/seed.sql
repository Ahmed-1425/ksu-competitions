-- Seed initial 10 participating universities
insert into public.universities (name_ar, name_en, slug, logo_path, sort_order, is_active)
values
  ('جامعة الملك سعود', 'King Saud University', 'ksu', '/universities/ksu.svg', 1, true),
  ('جامعة المعرفة', 'Almaarefa University', 'almaarefa', '/universities/almaarefa.svg', 2, true),
  ('جامعة الملك عبدالعزيز', 'King Abdulaziz University', 'kau', '/universities/kau.svg', 3, true),
  ('جامعة القصيم', 'Qassim University', 'qu', '/universities/qu.svg', 4, true),
  ('الجامعة الإسلامية بالمدينة المنورة', 'Islamic University of Madinah', 'iu', '/universities/iu.svg', 5, true),
  ('جامعة الملك خالد', 'King Khalid University', 'kku', '/universities/kku.svg', 6, true),
  ('جامعة حائل', 'University of Ha''il', 'uoh', '/universities/uoh.svg', 7, true),
  ('جامعة نجران', 'Najran University', 'nu', '/universities/nu.svg', 8, true),
  ('جامعة الأمير سطام بن عبدالعزيز', 'Prince Sattam Bin Abdulaziz University', 'psau', '/universities/psau.svg', 9, true),
  ('جامعة جدة', 'University of Jeddah', 'uj', '/universities/uj.svg', 10, true)
on conflict (name_ar) do update set
  name_en = excluded.name_en,
  slug = excluded.slug,
  sort_order = excluded.sort_order;

-- Seed default app settings
insert into public.app_settings (key, value)
values
  ('registration_open', 'true'::jsonb),
  ('notice_text', '{"ar": "", "en": ""}'::jsonb)
on conflict (key) do nothing;

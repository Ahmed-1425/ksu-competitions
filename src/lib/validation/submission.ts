import { z } from 'zod';

export const driveUrlRegex = /^https:\/\/(drive|docs)\.google\.com\/.*$/i;

export const submissionFormSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, { message: 'الاسم يجب أن يتكون من حرفين على الأقل' })
      .max(120, { message: 'الاسم يتجاوز 120 حرفاً' }),
    phone: z
      .string()
      .trim()
      .min(7, { message: 'رقم الجوال قصير جداً' })
      .max(30, { message: 'رقم الجوال يتجاوز 30 خانة' })
      .regex(/^[\+\d\s\-\(\)]+$/, { message: 'تنسيق رقم الجوال غير صحيح' }),
    university_id: z.string().nullable().optional(),
    university_other_name: z.string().trim().nullable().optional(),
    competition_type: z.enum(['report', 'photo', 'passport'], {
      message: 'يرجى اختيار مسار المسابقة',
    }),
    drive_url: z.string().trim().nullable().optional(),
    submitter_role: z.string().trim().nullable().optional(),
    photo_single_item_confirmed: z.boolean().default(false),
    passport_delivered: z.boolean().default(false),
    terms_accepted: z.boolean().refine((val) => val === true, {
      message: 'يجب الموافقة على الشروط وأحكام المسابقة',
    }),
    honeypot: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Check University selection logic
    const hasUniversityId = Boolean(data.university_id && data.university_id !== 'other');
    const hasOtherName = Boolean(data.university_other_name && data.university_other_name.trim().length > 0);

    if (!hasUniversityId && !hasOtherName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['university_id'],
        message: 'يرجى اختيار الجامعة أو إدخال اسمها',
      });
    }

    if (data.university_id === 'other' && (!data.university_other_name || data.university_other_name.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['university_other_name'],
        message: 'يرجى إدخال اسم الجامعة (حرفين على الأقل)',
      });
    }

    // Check Competition Type rules
    if (data.competition_type === 'report' || data.competition_type === 'photo') {
      if (!data.drive_url || data.drive_url.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['drive_url'],
          message: 'رابط Google Drive مطلوب لهذه الفئة',
        });
      } else if (!driveUrlRegex.test(data.drive_url.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['drive_url'],
          message: 'يجب أن يكون رابط HTTPS صالح من Google Drive (e.g. https://drive.google.com/...)',
        });
      }
    }

    if (data.competition_type === 'photo' && !data.photo_single_item_confirmed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['photo_single_item_confirmed'],
        message: 'يجب الإقرار والتأكيد على أن الرابط يحتوي صورة واحدة فقط',
      });
    }

    if (data.competition_type === 'passport') {
      if (data.drive_url && data.drive_url.trim() !== '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['drive_url'],
          message: 'لا يلزم إرفاق رابط Google Drive لمسار جواز السفر',
        });
      }
      if (!data.passport_delivered) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['passport_delivered'],
          message: 'يجب الإقرار بتسليم جواز السفر يدويًا مع كتابة اسمك عليه',
        });
      }
    }
  });

export type SubmissionFormInput = z.infer<typeof submissionFormSchema>;

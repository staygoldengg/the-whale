# Supabase Launch Checklist

## Create database

1. Create a Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Confirm the `profiles`, `ai_index_items`, `staff_profiles`, `school_brain_items`, `audit_logs`, and operations tables exist.

## Enable email auth

1. Go to Authentication settings.
2. Enable email login.
3. For internal MVP, keep signups controlled by only sharing the app with staff.

## Create first admin

1. Open the app locally or deployed.
2. Sign up with the admin email.
3. Run `supabase/admin-bootstrap.sql` after replacing the email.
4. Sign out and back in.

## Seed default index

After env vars are loaded locally:

```bash
npm run seed
```

## Production reminder

Do not put child-sensitive details into test data. Use classroom-level examples unless the school has approved a data policy.

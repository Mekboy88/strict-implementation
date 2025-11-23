-- Make user bf5e1e39-2fea-4842-bd39-f50a1167e77c a platform owner
INSERT INTO public.user_roles (user_id, role)
VALUES ('bf5e1e39-2fea-4842-bd39-f50a1167e77c', 'owner')
ON CONFLICT (user_id, role) DO NOTHING;
/*
# [SECURITY] Secure handle_new_user Function
This migration hardens the security of the `handle_new_user` function by explicitly setting its `search_path`.

## Query Description:
This operation modifies an existing function to make it more secure. It does not alter any user data and has no impact on existing records. By setting a fixed `search_path`, we prevent a class of security vulnerabilities where the function could be tricked into executing unintended code. This is a standard security best practice.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Modifies the function: `public.handle_new_user`

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: None
- Mitigates: `Function Search Path Mutable` warning. This change hardens the function against potential search path hijacking attacks.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. This is a metadata change on a function definition.
*/

ALTER FUNCTION public.handle_new_user()
SET search_path = 'public';

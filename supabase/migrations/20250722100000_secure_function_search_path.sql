/*
# [SECURITY] Secure Function Search Path
[This migration enhances security by setting a fixed `search_path` for the `handle_new_user` database function, mitigating potential risks associated with mutable search paths.]

## Query Description: [This operation modifies the `handle_new_user` function to explicitly set its `search_path` to `public`. This is a security best practice that prevents a class of attacks where a malicious user could create objects (like functions or tables) in a different schema that could be executed unintentionally. This change does not affect existing data and is considered safe to apply.]

## Metadata:
- Schema-Category: ["Security", "Safe"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Functions affected: `public.handle_new_user`

## Security Implications:
- RLS Status: [Not Affected]
- Policy Changes: [No]
- Auth Requirements: [None]
- Mitigates: Search Path Hijacking.

## Performance Impact:
- Indexes: [Not Affected]
- Triggers: [Not Affected]
- Estimated Impact: [Negligible performance impact. This is a configuration change.]
*/
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';

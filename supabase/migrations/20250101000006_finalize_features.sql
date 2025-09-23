/*
# [Function] `get_conversations`
Creates a function to retrieve a user's message conversations, ordered by the most recent message.

## Query Description:
This function simplifies fetching conversation partners for the messaging feature. It finds all unique users someone has exchanged messages with and returns their profile information along with the timestamp of the last message. This is a safe, read-only operation.

## Metadata:
- Schema-Category: ["Safe"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Function: `public.get_conversations`

## Security Implications:
- RLS Status: N/A (Function runs with the invoker's permissions)
- Policy Changes: No
- Auth Requirements: A user must be authenticated to get their own conversations.

## Performance Impact:
- Indexes: Uses existing indexes on `messages` table.
- Triggers: None
- Estimated Impact: Low. Improves performance by simplifying client-side logic.
*/
CREATE OR REPLACE FUNCTION public.get_conversations(p_user_id uuid)
RETURNS TABLE(
    user_id uuid,
    username text,
    avatar_url text,
    last_message_at timestamptz
) AS $$
BEGIN
    RETURN QUERY
    WITH message_partners AS (
        SELECT
            CASE
                WHEN sender_id = p_user_id THEN receiver_id
                ELSE sender_id
            END as partner_id,
            created_at
        FROM public.messages
        WHERE sender_id = p_user_id OR receiver_id = p_user_id
    ),
    latest_messages AS (
        SELECT
            partner_id,
            MAX(created_at) as max_created_at
        FROM message_partners
        GROUP BY partner_id
    )
    SELECT
        p.id,
        p.username,
        p.avatar_url,
        lm.max_created_at
    FROM latest_messages lm
    JOIN public.profiles p ON lm.partner_id = p.id
    ORDER BY lm.max_created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

/*
# [Security] Set Search Path for Functions
Sets a secure search_path for all user-defined functions to mitigate potential security vulnerabilities.

## Query Description:
This operation updates the configuration of existing database functions to explicitly define their search path. This prevents a malicious user from temporarily creating objects (like tables or functions) in a public schema that could be executed by these functions, which is a security best practice. This addresses the "[WARN] Function Search Path Mutable" advisories.

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Functions: `handle_new_user`, `create_notification_on_like`, `create_notification_on_comment`, `create_notification_on_follow`, `get_conversations`

## Security Implications:
- RLS Status: N/A
- Policy Changes: No
- Auth Requirements: Admin privileges.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. Improves security without performance cost.
*/
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.create_notification_on_like() SET search_path = public;
ALTER FUNCTION public.create_notification_on_comment() SET search_path = public;
ALTER FUNCTION public.create_notification_on_follow() SET search_path = public;
ALTER FUNCTION public.get_conversations(uuid) SET search_path = public;

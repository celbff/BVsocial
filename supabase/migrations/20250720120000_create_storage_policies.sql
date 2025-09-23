/*
          # [Operation Name] Create Storage RLS Policies for Posts
          [This script sets up the necessary security policies for the 'posts' storage bucket, allowing users to upload images and the public to view them.]

          ## Query Description: [This operation configures Row Level Security (RLS) for Supabase Storage. It creates two policies on the `storage.objects` table specifically for the `posts` bucket:
1.  **Uploads:** Grants `INSERT` permissions to any authenticated user, allowing them to upload files into the `posts` bucket.
2.  **Downloads:** Grants `SELECT` permissions to everyone (public), allowing their browsers to download and display the post images.
This ensures that only logged-in users can create posts, but anyone can see the resulting images, which is standard for a social media app. There is no risk to existing data as this only adds permissions.]
          
          ## Metadata:
          - Schema-Category: ["Security", "Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          - Tables Affected: `storage.objects`
          - Policies Created: 
            - "Authenticated users can upload posts"
            - "Anyone can view posts"
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [Policies distinguish between `authenticated` users and `public`.]
          
          ## Performance Impact:
          - Indexes: [None]
          - Triggers: [None]
          - Estimated Impact: [Negligible. RLS policy checks have minimal overhead on storage operations.]
          */

-- 1. Create policy to allow authenticated users to upload files to the 'posts' bucket.
-- This policy checks if the user is logged in (`authenticated` role) and if the file is being inserted into the correct bucket (`posts`).
CREATE POLICY "Authenticated users can upload posts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts');

-- 2. Create policy to allow anyone to view/download files from the 'posts' bucket.
-- This policy allows public access (`public` role) for reading files, which is necessary for images to be displayed in the app.
CREATE POLICY "Anyone can view posts"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts');

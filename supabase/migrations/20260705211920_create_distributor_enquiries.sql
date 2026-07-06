/*
# Create distributor_enquiries table

Single-tenant (no auth). Stores enquiries submitted from the distributor form.

1. New Tables
   - `distributor_enquiries`
     - `id` (uuid, primary key)
     - `name` (text, not null) — full name of the applicant
     - `phone` (text, not null) — phone number
     - `email` (text, not null) — email address
     - `city` (text, not null) — city
     - `state` (text, not null) — selected Indian state
     - `created_at` (timestamptz, default now())

2. Security
   - RLS enabled.
   - Anon + authenticated can INSERT (public form submission).
   - No SELECT/UPDATE/DELETE policies — only the service-role (edge function) reads the data.
*/

CREATE TABLE IF NOT EXISTS distributor_enquiries (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  phone      text NOT NULL,
  email      text NOT NULL,
  city       text NOT NULL,
  state      text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE distributor_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_enquiries" ON distributor_enquiries;
CREATE POLICY "anon_insert_enquiries" ON distributor_enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

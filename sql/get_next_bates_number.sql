-- Add Bates prefix and counter to cases, and create atomic function to allocate next bates number

-- Add columns if they don't exist
ALTER TABLE IF EXISTS cases
ADD COLUMN IF NOT EXISTS bates_prefix text DEFAULT 'DEF';

ALTER TABLE IF EXISTS cases
ADD COLUMN IF NOT EXISTS bates_counter integer DEFAULT 0;

-- Create or replace function to atomically increment and return formatted Bates number
CREATE OR REPLACE FUNCTION public.get_next_bates_number(case_uuid uuid)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  prefix text;
  cleaned_prefix text;
  cnt integer;
  formatted text;
BEGIN
  -- Atomically increment the counter and return prefix and new counter
  UPDATE cases
  SET bates_counter = COALESCE(bates_counter, 0) + 1
  WHERE id = case_uuid
  RETURNING COALESCE(bates_prefix, 'DEF'), bates_counter
  INTO prefix, cnt;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Case not found: %', case_uuid;
  END IF;

  -- Clean prefix: keep alphanumeric and uppercase
  cleaned_prefix := upper(regexp_replace(prefix, '[^A-Za-z0-9]', '', 'g'));
  IF cleaned_prefix = '' THEN
    cleaned_prefix := 'DEF';
  END IF;

  formatted := cleaned_prefix || '-' || lpad(cnt::text, 3, '0');

  RETURN formatted;
END;
$$;

-- Grant execute to anon role if desired (optional, uncomment if you use anon client-side RPC)
-- GRANT EXECUTE ON FUNCTION public.get_next_bates_number(uuid) TO anon;

-- Example usage:
-- SELECT public.get_next_bates_number('case-uuid-here'::uuid);


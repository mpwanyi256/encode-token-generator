-- Drop the overly restrictive constraint
ALTER TABLE tokens DROP CONSTRAINT IF EXISTS check_scopes;

-- Add a proper constraint that allows any combination of valid scopes
-- This checks that the array is not empty and all values are one of: 'read', 'write', 'delete'
-- The <@ operator checks if the left array is contained in the right array
ALTER TABLE tokens ADD CONSTRAINT check_scopes CHECK (
    array_length(scopes, 1) > 0 
    AND scopes <@ ARRAY['read', 'write', 'delete']::TEXT[]
);


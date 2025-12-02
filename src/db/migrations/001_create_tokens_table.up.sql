CREATE TABLE tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL, -- We would have a users table in a prod env
    scopes TEXT[] NOT NULL, -- We would have a scopes table in a prod env
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    token TEXT NOT NULL
);

CREATE INDEX idx_tokens_user_id ON tokens (user_id);
CREATE INDEX idx_tokens_expires_at ON tokens (expires_at);

--  Add a check constraint to make sure that the scopes array is not empty and MUST ONLY contain the values "read", "write", "delete"
ALTER TABLE tokens ADD CONSTRAINT check_scopes CHECK (array_length(scopes, 1) > 0 AND scopes = ARRAY['read', 'write', 'delete']);

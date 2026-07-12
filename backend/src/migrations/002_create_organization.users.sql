CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE organization_users (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    role VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE
);

CREATE TRIGGER update_organization_users_updated_at
BEFORE UPDATE ON organization_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
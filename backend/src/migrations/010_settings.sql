CREATE TABLE organization_settings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID UNIQUE NOT NULL,

    company_email VARCHAR(255),

    company_phone VARCHAR(30),

    company_address TEXT,

    timezone VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_settings_org
    FOREIGN KEY (organization_id)
    REFERENCES organizations(id)
    ON DELETE CASCADE
);

CREATE TRIGGER update_organization_settings_updated_at
BEFORE UPDATE ON organization_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
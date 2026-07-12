CREATE TABLE drivers (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    phone VARCHAR(20),

    license_number VARCHAR(100),

    license_expiry DATE,

    experience_years INT,

    status VARCHAR(30) DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_driver_org
    FOREIGN KEY (organization_id)
    REFERENCES organizations(id)
    ON DELETE CASCADE
);

CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON drivers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
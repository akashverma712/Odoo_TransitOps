CREATE TABLE vehicles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    vehicle_number VARCHAR(30) NOT NULL,

    vehicle_type VARCHAR(50) NOT NULL,

    model VARCHAR(100) NOT NULL,

    manufacturer VARCHAR(100) NOT NULL,

    manufacturing_year INT,

    fuel_type VARCHAR(30),

    capacity INT,

    registration_number VARCHAR(50),

    insurance_expiry DATE,

    pollution_expiry DATE,

    status VARCHAR(30) DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vehicle_org
    FOREIGN KEY (organization_id)
    REFERENCES organizations(id)
    ON DELETE CASCADE
);

CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
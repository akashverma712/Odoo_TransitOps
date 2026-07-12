CREATE TABLE maintenance (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    vehicle_id UUID,

    service_type VARCHAR(100),

    service_date DATE,

    next_service DATE,

    cost NUMERIC(10,2),

    status VARCHAR(30) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_maintenance_org
    FOREIGN KEY (organization_id)
    REFERENCES organizations(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_maintenance_vehicle
    FOREIGN KEY (vehicle_id)
    REFERENCES vehicles(id)
    ON DELETE SET NULL
);

CREATE TRIGGER update_maintenance_updated_at
BEFORE UPDATE ON maintenance
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
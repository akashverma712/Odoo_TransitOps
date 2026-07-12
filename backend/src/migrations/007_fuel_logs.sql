CREATE TABLE fuel_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    vehicle_id UUID,

    liters NUMERIC(8,2),

    amount NUMERIC(10,2),

    filled_on DATE,

    fuel_station VARCHAR(150),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fuel_org
    FOREIGN KEY (organization_id)
    REFERENCES organizations(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_fuel_vehicle
    FOREIGN KEY (vehicle_id)
    REFERENCES vehicles(id)
    ON DELETE SET NULL
);

CREATE TRIGGER update_fuel_logs_updated_at
BEFORE UPDATE ON fuel_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
CREATE TABLE trips (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    vehicle_id UUID,

    driver_id UUID,

    source VARCHAR(150),

    destination VARCHAR(150),

    start_time TIMESTAMP,

    end_time TIMESTAMP,

    status VARCHAR(30) DEFAULT 'Scheduled',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_trip_org
    FOREIGN KEY (organization_id)
    REFERENCES organizations(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_trip_vehicle
    FOREIGN KEY (vehicle_id)
    REFERENCES vehicles(id)
    ON DELETE SET NULL,

    CONSTRAINT fk_trip_driver
    FOREIGN KEY (driver_id)
    REFERENCES drivers(id)
    ON DELETE SET NULL
);

CREATE TRIGGER update_trips_updated_at
BEFORE UPDATE ON trips
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
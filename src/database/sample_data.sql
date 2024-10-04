-- Insert sample data into profiles table
INSERT INTO
  profiles (email, full_name, phone_number, role)
VALUES
  ('john.doe@example.com', 'John Doe', '123-456-7890', 'user'),
  ('jane.smith@example.com', 'Jane Smith', '098-765-4321', 'admin');

-- Retrieve profile IDs
SELECT id, full_name FROM profiles;

-- Insert sample data into services table
INSERT INTO
  services (service_name, description, price)
VALUES
  ('Towing Service', 'Emergency towing service available 24/7', 50.00),
  ('Roadside Assistance', 'Help with flat tires, dead batteries, etc.', 30.00);

-- Insert sample data into services_logs table
INSERT INTO
  services_logs (profile_id, service_id, status, total_cost)
VALUES
  (
    (SELECT id FROM profiles WHERE full_name = 'John Doe'),
    (SELECT id FROM services WHERE service_name = 'Towing Service'),
    'completed',
    75.00
  ),
  (
    (SELECT id FROM profiles WHERE full_name = 'Jane Smith'),
    (SELECT id FROM services WHERE service_name = 'Roadside Assistance'),
    'pending',
    30.00
  );

-- Update services_logs entries with more detailed booking information
UPDATE services_logs
SET 
  pickup_address = '123 Main St',
  dropoff_address = '456 Elm St',
  vehicle_brand = 'Honda',
  vehicle_model = 'Civic',
  vehicle_size = 'Sedan'
WHERE profile_id = (SELECT id FROM profiles WHERE full_name = 'John Doe');

UPDATE services_logs
SET 
  pickup_address = '789 Oak St',
  dropoff_address = '101 Pine St',
  vehicle_brand = 'Toyota',
  vehicle_model = 'Corolla',
  vehicle_size = 'Sedan'
WHERE profile_id = (SELECT id FROM profiles WHERE full_name = 'Jane Smith');
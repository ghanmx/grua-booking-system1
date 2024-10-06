export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  pickup_location: string;
  dropoff_location: string;
  vehicle_details: {
    brand: string;
    model: string;
    color: string;
    license_plate: string;
    size: 'small' | 'medium' | 'large';
  };
  distance: number;
  total_cost: number;
  pickup_datetime: string;
  additional_details?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  price_per_km: number;
  maneuver_charge: number;
  tow_truck_type: 'A' | 'C' | 'D';
}
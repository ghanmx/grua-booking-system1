import { getTowTruckType, calculateTotalCost, getVehicleSize } from '../towTruckSelection';

describe('towTruckSelection', () => {
  describe('getTowTruckType', () => {
    it('should return correct tow truck type for vehicle size', () => {
      expect(getTowTruckType('small')).toBe('A');
      expect(getTowTruckType('medium')).toBe('C');
      expect(getTowTruckType('large')).toBe('D');
      expect(getTowTruckType('unknown')).toBe('A');
    });
  });

  describe('calculateTotalCost', () => {
    it('should calculate correct cost without maneuver', () => {
      expect(calculateTotalCost(10, 'A', false)).toBe(717.89);
      expect(calculateTotalCost(10, 'C', false)).toBe(956.49);
      expect(calculateTotalCost(10, 'D', false)).toBe(1209.34);
    });

    it('should calculate correct cost with maneuver', () => {
      expect(calculateTotalCost(10, 'A', true)).toBe(1937.44);
      expect(calculateTotalCost(10, 'C', true)).toBe(2480.70);
      expect(calculateTotalCost(10, 'D', true)).toBe(3310.99);
    });
  });

  describe('getVehicleSize', () => {
    it('should return correct size for known models', () => {
      expect(getVehicleSize('Ford F-150')).toBe('medium');
      expect(getVehicleSize('Ford F-250')).toBe('large');
      expect(getVehicleSize('Toyota Corolla')).toBe('small');
    });

    it('should return "small" for unknown models', () => {
      expect(getVehicleSize('Unknown Model')).toBe('small');
    });
  });
});
export const getTowTruckType = (vehicleSize) => {
  switch (vehicleSize) {
    case 'A':
      return 'A';
    case 'B':
      return 'B';
    case 'C':
      return 'C';
    case 'D':
      return 'D';
    default:
      return 'B';
  }
};

export const getTowTruckPricing = (towTruckType) => {
  const pricing = {
    A: { perKm: 18.82, basePrice: 528.69 },
    B: { perKm: 20.62, basePrice: 607.43 },
    C: { perKm: 23.47, basePrice: 721.79 },
    D: { perKm: 32.35, basePrice: 885.84 },
  };
  return pricing[towTruckType] || pricing.B;
};

export const calculateTotalCost = (distance, towTruckType) => {
  const { perKm, basePrice } = getTowTruckPricing(towTruckType);
  const totalCost = basePrice + (distance * perKm);
  return Number(totalCost.toFixed(2)); // Round to 2 decimal places
};
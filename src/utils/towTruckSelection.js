export const getTowTruckType = (vehicleSize) => {
  switch (vehicleSize) {
    case 'Small':
      return 'A';
    case 'Medium':
      return 'B';
    case 'Large':
      return 'C';
    case 'Extra Large':
      return 'D';
    default:
      return 'A';
  }
};

export const getTowTruckPricing = (towTruckType) => {
  const pricing = {
    A: { perKm: 18.82, basePrice: 528.69 },
    B: { perKm: 20.62, basePrice: 607.43 },
    C: { perKm: 23.47, basePrice: 721.79 },
    D: { perKm: 32.35, basePrice: 885.84 },
  };
  return pricing[towTruckType] || pricing.A;
};
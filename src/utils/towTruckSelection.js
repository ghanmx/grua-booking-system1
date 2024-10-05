export const getTowTruckType = (vehicleSize) => {
  switch (vehicleSize) {
    case 'small':
      return 'A';
    case 'medium':
      return 'C';
    case 'large':
      return 'D';
    default:
      return 'A';
  }
};

export const getTowTruckPricing = (towTruckType) => {
  const pricing = {
    A: { perKm: 18.82, basePrice: 528.69, maneuverCharge: 1219.55 },
    C: { perKm: 23.47, basePrice: 721.79, maneuverCharge: 1524.21 },
    D: { perKm: 32.35, basePrice: 885.84, maneuverCharge: 2101.65 },
  };
  return pricing[towTruckType] || pricing.A;
};

export const calculateTotalCost = (distance, towTruckType, requiresManeuver) => {
  const { perKm, basePrice, maneuverCharge } = getTowTruckPricing(towTruckType);
  let totalCost = basePrice + (distance * perKm);
  if (requiresManeuver) {
    totalCost += maneuverCharge;
  }
  return Number(totalCost.toFixed(2)); // Round to 2 decimal places
};

export const getVehicleSize = (vehicleModel) => {
  const largeCars = ['Dodge Challenger', 'Dodge Charger', 'Ford F-150', 'Chevrolet Silverado', 'RAM 1500'];
  const trucks = ['Ford F-250', 'Ford F-350', 'Chevrolet Silverado 2500HD', 'RAM 2500', 'RAM 3500'];

  if (trucks.includes(vehicleModel)) {
    return 'large';
  } else if (largeCars.includes(vehicleModel)) {
    return 'medium';
  } else {
    return 'small';
  }
};
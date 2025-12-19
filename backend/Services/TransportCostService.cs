namespace TriLink.Services
{
    public interface ITransportCostService
    {
        CostBreakdown CalculateCost(
            double distanceKm,
            double durationHours,
            decimal totalWeight,
            decimal? length,
            decimal? width,
            decimal? height,
            bool isFragile,
            bool isHighValue,
            string pickupCity,
            string dropCity);
    }

    public class TransportCostService : ITransportCostService
    {
        // Vehicle configurations: Name, MaxCapacityKg, FuelPer100Km, MaintenancePerKm, DriverHourlyRate
        private static readonly Dictionary<string, VehicleConfig> Vehicles = new()
        {
            ["LCV"] = new("Light Commercial Vehicle", 2000, 12, 2.0, 150),
            ["MGV"] = new("Medium Goods Vehicle", 7500, 18, 3.5, 200),
            ["HDT"] = new("Heavy Duty Truck", 16000, 25, 5.0, 250),
            ["MAT"] = new("Multi-Axle Trailer", 40000, 35, 7.0, 300),
            ["4x4"] = new("4x4 Cargo Truck", 12000, 28, 8.0, 350)
        };

        private const double DieselPricePerLiter = 95.0;
        private const double TollRatePerKm = 2.0;
        private const int DimFactor = 5000; // Dimensional weight divisor for road freight

        public CostBreakdown CalculateCost(
            double distanceKm,
            double durationHours,
            decimal totalWeight,
            decimal? length,
            decimal? width,
            decimal? height,
            bool isFragile,
            bool isHighValue,
            string pickupCity,
            string dropCity)
        {
            // 1. Calculate Chargeable Weight (max of actual vs volumetric)
            decimal volumetricWeight = 0;
            if (length.HasValue && width.HasValue && height.HasValue)
            {
                volumetricWeight = (length.Value * width.Value * height.Value) / DimFactor;
            }
            decimal chargeableWeight = Math.Max(totalWeight, volumetricWeight);

            // 2. Detect terrain type
            bool isMountain = IsMountainRoute(pickupCity, dropCity);
            double terrainFactor = isMountain ? 1.5 : 1.0;

            // 3. Select appropriate vehicle
            var vehicle = SelectVehicle(chargeableWeight, distanceKm, isMountain);

            // 4. Calculate Load Factor (heavier load = more fuel)
            double loadFactor = 1 + ((double)chargeableWeight / vehicle.MaxCapacityKg) * 0.25;

            // 5. Calculate Fuel Cost
            double adjustedConsumption = vehicle.FuelConsumptionPer100Km * loadFactor * terrainFactor;
            double fuelLiters = (distanceKm / 100) * adjustedConsumption;
            double fuelCost = fuelLiters * DieselPricePerLiter;

            // 6. Calculate Driver Cost
            double driverCost = durationHours * vehicle.DriverHourlyRate;

            // 7. Calculate Toll Cost (only for highway routes > 100km)
            double tollCost = distanceKm > 100 ? distanceKm * TollRatePerKm : 0;

            // 8. Calculate Maintenance Cost
            double maintenanceCost = distanceKm * vehicle.MaintenanceCostPerKm;

            // 9. Calculate Subtotal
            double subtotal = fuelCost + driverCost + tollCost + maintenanceCost;

            // 10. Calculate Insurance (base 2% + premiums for special cargo)
            double insuranceRate = 0.02;
            if (isFragile) insuranceRate += 0.015;
            if (isHighValue) insuranceRate += 0.025;
            double insuranceCost = subtotal * insuranceRate;

            // 11. Add Business Overhead (10%)
            double overhead = (subtotal + insuranceCost) * 0.10;

            // 12. Calculate Final Total
            double totalCost = subtotal + insuranceCost + overhead;

            return new CostBreakdown
            {
                VehicleType = vehicle.Name,
                ChargeableWeightKg = (double)chargeableWeight,
                ActualWeightKg = (double)totalWeight,
                VolumetricWeightKg = (double)volumetricWeight,

                FuelCost = Math.Round(fuelCost, 0),
                FuelLiters = Math.Round(fuelLiters, 1),
                DriverCost = Math.Round(driverCost, 0),
                TollCost = Math.Round(tollCost, 0),
                MaintenanceCost = Math.Round(maintenanceCost, 0),
                InsuranceCost = Math.Round(insuranceCost, 0),
                OverheadCost = Math.Round(overhead, 0),
                TotalCost = Math.Round(totalCost, 0),

                TerrainType = isMountain ? "Mountain" : "Plain",
                LoadFactor = Math.Round(loadFactor, 2)
            };
        }

        private VehicleConfig SelectVehicle(decimal chargeableWeight, double distanceKm, bool isMountain)
        {
            // Mountain routes always use 4x4
            if (isMountain) return Vehicles["4x4"];

            // Select by weight capacity
            if (chargeableWeight > 16000) return Vehicles["MAT"];
            if (chargeableWeight > 7500) return Vehicles["HDT"];
            if (chargeableWeight > 2000) return Vehicles["MGV"];
            if (chargeableWeight > 500 && distanceKm > 150) return Vehicles["MGV"];
            return Vehicles["LCV"];
        }

        private bool IsMountainRoute(string pickup, string drop)
        {
            var mountainAreas = new[] { "Ooty", "Manali", "Shimla", "Munnar", "Kodaikanal", "Darjeeling", "Coorg", "Mussoorie" };
            return mountainAreas.Any(m =>
                (pickup?.Contains(m, StringComparison.OrdinalIgnoreCase) ?? false) ||
                (drop?.Contains(m, StringComparison.OrdinalIgnoreCase) ?? false));
        }
    }

    public record VehicleConfig(
        string Name,
        int MaxCapacityKg,
        double FuelConsumptionPer100Km,
        double MaintenanceCostPerKm,
        double DriverHourlyRate);

    public class CostBreakdown
    {
        public string VehicleType { get; set; }
        public double ChargeableWeightKg { get; set; }
        public double ActualWeightKg { get; set; }
        public double VolumetricWeightKg { get; set; }

        public double FuelCost { get; set; }
        public double FuelLiters { get; set; }
        public double DriverCost { get; set; }
        public double TollCost { get; set; }
        public double MaintenanceCost { get; set; }
        public double InsuranceCost { get; set; }
        public double OverheadCost { get; set; }
        public double TotalCost { get; set; }

        public string TerrainType { get; set; }
        public double LoadFactor { get; set; }
    }
}

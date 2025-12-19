namespace TriLink.DTOs
{
    public class RouteResponseDto
    {
        public string? Distance { get; set; }
        public string? Duration { get; set; }
        public string? FuelCost { get; set; }
        public string? DriverExperience { get; set; }
        public string? VehicleType { get; set; }
        public string? RouteGeometry { get; set; }
        public double[]? OriginCoords { get; set; }
        public double[]? DestinationCoords { get; set; }
        
        // Detailed cost breakdown
        public CostBreakdownDto? CostBreakdown { get; set; }
    }
    
    public class CostBreakdownDto
    {
        public string? VehicleType { get; set; }
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
        
        public string? TerrainType { get; set; }
        public double LoadFactor { get; set; }
    }
}

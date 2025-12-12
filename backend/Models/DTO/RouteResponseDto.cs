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
    }
}

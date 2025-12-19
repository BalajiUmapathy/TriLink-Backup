namespace TriLink.DTOs
{
    public class RouteRequestDto
    {
        public string? Origin { get; set; }
        public string? Destination { get; set; }
        public string? OriginCity { get; set; }
        public string? DestinationCity { get; set; }
        
        // Cargo details for cost calculation
        public decimal? TotalWeight { get; set; }
        public decimal? Length { get; set; }
        public decimal? Width { get; set; }
        public decimal? Height { get; set; }
        public bool? IsFragile { get; set; }
        public bool? IsHighValue { get; set; }
    }
}

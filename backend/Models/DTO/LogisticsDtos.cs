namespace Backend.Models.DTO
{
    public class LogisticsDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public string ProductName { get; set; }
        public Guid? ProviderId { get; set; }
        public string ProviderName { get; set; }
        public string PickupLocation { get; set; }
        public string DropLocation { get; set; }
        public double EstimatedDistanceKm { get; set; }
        public decimal ProposedCost { get; set; }
        public string Status { get; set; }
    }

    public class CreateLogisticsDto
    {
        public Guid OrderId { get; set; }
        public string PickupLocation { get; set; }
        public string DropLocation { get; set; }
        public double EstimatedDistanceKm { get; set; }
    }
}

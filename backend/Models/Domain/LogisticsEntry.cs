namespace Backend.Models.Domain
{
    public class LogisticsEntry
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Order Order { get; set; }
        
        // Provider who accepts the job
        public Guid? ProviderId { get; set; }
        public User? Provider { get; set; }

        public string PickupLocation { get; set; }
        public string DropLocation { get; set; }
        
        public double EstimatedDistanceKm { get; set; } // For logic
        public decimal ProposedCost { get; set; }

        public string Status { get; set; } = "Open"; // Open, Assigned, InTransit, Delivered
    }
}

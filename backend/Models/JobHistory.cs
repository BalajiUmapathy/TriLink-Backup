using System;

namespace Backend.Models.Domain
{
    public class JobHistory
    {
        public Guid Id { get; set; }
        public Guid JobId { get; set; }
        public Guid LogisticsProviderId { get; set; }
        
        // Route planning data
        public string PlannedDistance { get; set; }
        public string PlannedDuration { get; set; }
        public string DriverExperience { get; set; }
        public string VehicleType { get; set; }
        
        // Completion data
        public DateTime CompletedDate { get; set; }
        public string Status { get; set; } // "Delivered", "Completed"
        public DateTime CreatedAt { get; set; }
        
        // Navigation property
        public virtual BuyerLogisticsJob Job { get; set; }
    }
}


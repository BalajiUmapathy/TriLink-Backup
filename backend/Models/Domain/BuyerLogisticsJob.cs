using System;

namespace Backend.Models.Domain
{
    public class BuyerLogisticsJob
    {
        public Guid Id { get; set; }
        
        // User who created the job
        public Guid BuyerId { get; set; }
        public User Buyer { get; set; }
        
        // Pickup Details
        public string PickupAddressLine1 { get; set; }
        public string PickupAddressLine2 { get; set; }
        public string PickupLandmark { get; set; }
        public string PickupCity { get; set; }
        public string PickupState { get; set; }
        public string PickupPincode { get; set; }
        
        // Drop Details
        public string DropAddressLine1 { get; set; }
        public string DropAddressLine2 { get; set; }
        public string DropLandmark { get; set; }
        public string DropCity { get; set; }
        public string DropState { get; set; }
        public string DropPincode { get; set; }
        
        // Timing & Schedule
        public DateTime PickupDate { get; set; }
        public string PickupTimeSlot { get; set; }
        public DateTime DeliveryExpectedDate { get; set; }
        public string DeliveryTimeWindow { get; set; }
        public string ShipmentPriority { get; set; } // Normal, Express, Same-day, Overnight
        
        // Pallet & Load Details
        public int PalletCount { get; set; }
        public decimal TotalWeight { get; set; }
        public decimal? Length { get; set; }
        public decimal? Width { get; set; }
        public decimal? Height { get; set; }
        public string MaterialType { get; set; }
        public bool IsFragile { get; set; }
        public bool IsHighValue { get; set; }
        public string SpecialHandling { get; set; }
        
        // Documentation & Compliance
        public string EwayBillNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public string GstNumber { get; set; }
        public string MaterialCategory { get; set; } // Hazardous, Non-Hazardous
        
        // Sender Contact
        public string SenderName { get; set; }
        public string SenderCompanyName { get; set; } // Optional
        public string SenderMobile { get; set; }
        public string SenderEmail { get; set; }
        
        // Job Status & Metadata
        public string Status { get; set; } = "Active"; // Active, Completed, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public ICollection<BuyerLogisticsJobQuote> Quotes { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Route Planning Data (saved when route is finalized)
        public string PlannedDistance { get; set; }
        public string PlannedDuration { get; set; }
        public string PlannedDriverExperience { get; set; }
        public string PlannedVehicleType { get; set; }
        public DateTime? RoutePlannedAt { get; set; }
        public string RoutePolyline { get; set; } // Encoded polyline for map display
        
        // Computed properties for display
        public string PickupLocation => $"{PickupCity}, {PickupState}";
        public string DropLocation => $"{DropCity}, {DropState}";
        public decimal? VolumetricWeight => (Length.HasValue && Width.HasValue && Height.HasValue) 
            ? (Length.Value * Width.Value * Height.Value) / 5000 
            : null;
    }
}

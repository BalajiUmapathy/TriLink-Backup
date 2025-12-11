using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Domain
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public int Quantity { get; set; }
        public string Location { get; set; } // Pickup Address
        public string? ImageUrl { get; set; }
        public string Category { get; set; }
        public string Unit { get; set; }
        public int MinOrderQty { get; set; }
        public int LeadTime { get; set; } // In days
        public string Status { get; set; } // Active, Draft, Out of Stock
        
        public Guid SupplierId { get; set; }
        // Navigation property will be added later if needed, avoiding cycles for now or adding simple one
        public User Supplier { get; set; }
        
        public string? CertificateUrl { get; set; }
    }
}

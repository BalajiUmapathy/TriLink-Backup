namespace Backend.Models.Domain
{
    public class Invoice
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } // Format: INV-{Year}-{SequentialNumber}
        
        public Guid OrderId { get; set; }
        public Order Order { get; set; }
        
        public Guid SupplierId { get; set; }
        public User Supplier { get; set; }
        
        public Guid BuyerId { get; set; }
        public User Buyer { get; set; }
        
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        
        public decimal SubTotal { get; set; }
        public decimal TaxRate { get; set; } // Percentage (e.g., 18 for 18%)
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        
        public string Status { get; set; } = "Draft"; // Draft, Finalized
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

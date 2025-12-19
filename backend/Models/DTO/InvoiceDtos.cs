namespace Backend.Models.DTO
{
    public class InvoiceDto
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; }
        
        public Guid OrderId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        
        public Guid SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string? SupplierCompanyName { get; set; }
        public string? SupplierGSTNumber { get; set; }
        public string? SupplierAddress { get; set; }
        public string? SupplierContactNumber { get; set; }
        
        public Guid BuyerId { get; set; }
        public string BuyerName { get; set; }
        public string? BuyerCompanyName { get; set; }
        public string? BuyerGSTNumber { get; set; }
        public string? BuyerAddress { get; set; }
        
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        
        public decimal SubTotal { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        
        public string Status { get; set; }
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
    
    public class CreateInvoiceDto
    {
        public Guid OrderId { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public DateTime? DueDate { get; set; }
        public decimal? TaxRate { get; set; } // Optional, defaults to 18
        public string? Notes { get; set; }
    }
    
    public class UpdateInvoiceDto
    {
        public DateTime? InvoiceDate { get; set; }
        public DateTime? DueDate { get; set; }
        public decimal? TaxRate { get; set; }
        public string? Notes { get; set; }
    }
    
    public class FinalizeInvoiceDto
    {
        public bool Confirmed { get; set; } = true;
    }
}

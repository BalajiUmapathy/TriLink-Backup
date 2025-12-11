namespace Backend.Models.DTO
{
    public class ProductRequestDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public int Quantity { get; set; }
        public string Location { get; set; }
        public string? ImageUrl { get; set; }
        public string? CertificateUrl { get; set; }
        public string Category { get; set; }
        public string Unit { get; set; }
        public int MinOrderQty { get; set; }
        public int LeadTime { get; set; }
        public string Status { get; set; }
        public Guid? SupplierId { get; set; } 
        
        public IFormFile? ImageFile { get; set; }
        public IFormFile? CertificateFile { get; set; }
    }

    public class ProductResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public int Quantity { get; set; }
        public string Location { get; set; }
        public string ImageUrl { get; set; }
        public string CertificateUrl { get; set; }
        public string Category { get; set; }
        public string Unit { get; set; }
        public int MinOrderQty { get; set; }
        public int LeadTime { get; set; }
        public string Status { get; set; }
        public Guid SupplierId { get; set; }
        // Flattened Supplier Name if needed
        public string SupplierName { get; set; }
        public string SupplierCompanyName { get; set; }
        public string SupplierContactPerson { get; set; }
        public string SupplierEmail { get; set; }
        public string SupplierContactNumber { get; set; }
    }
}

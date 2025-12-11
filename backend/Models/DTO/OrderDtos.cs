namespace Backend.Models.DTO
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal FinalPrice { get; set; }
        public string Status { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public DateTime CreatedAt { get; set; }
        
        public Guid BuyerId { get; set; }
        public string BuyerName { get; set; }
        
        public Guid SellerId { get; set; }
        public string SellerName { get; set; }
    }
}

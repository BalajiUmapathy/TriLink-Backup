namespace Backend.Models.DTO
{
    public class NegotiationDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } // Flattened
        public Guid BuyerId { get; set; }
        public string BuyerName { get; set; }
        public string BuyerCompanyName { get; set; }
        public string BuyerEmail { get; set; }
        public string BuyerContactNumber { get; set; }
        public Guid SellerId { get; set; }
        public string SellerName { get; set; }
        public string Status { get; set; }
        public decimal CurrentOfferAmount { get; set; }
        public List<OfferDto> Offers { get; set; }
    }

    public class CreateNegotiationDto
    {
        public Guid ProductId { get; set; }
        public decimal InitialOfferAmount { get; set; }
        public string Message { get; set; }
    }

    public class OfferDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid ProposerId { get; set; }
    }

    public class AddOfferDto
    {
        public decimal Amount { get; set; }
        public string Message { get; set; }
    }

    public class UpdateNegotiationStatusDto
    {
        public string Status { get; set; } // Accepted, Rejected
    }
}

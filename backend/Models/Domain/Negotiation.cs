using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Domain
{
    public class Negotiation
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Product Product { get; set; } 
        
        public Guid BuyerId { get; set; }
        public User Buyer { get; set; }
        
        public Guid SellerId { get; set; }
        public User Seller { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected
        
        public decimal CurrentOfferAmount { get; set; }
        
        // Navigation property for history
        public List<Offer> Offers { get; set; }
    }

    public class Offer
    {
        public Guid Id { get; set; }
        public Guid NegotiationId { get; set; }
        public decimal Amount { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid ProposerId { get; set; } // Who made this offer (Buyer or Seller)
    }
}

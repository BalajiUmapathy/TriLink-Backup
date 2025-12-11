using Backend.Models.Domain;

namespace Backend.Repositories
{
    public interface INegotiationRepository
    {
        Task<List<Negotiation>> GetAllAsync(Guid? userId = null, string? role = null); // Role: "Buyer" or "Seller"
        Task<Negotiation?> GetByIdAsync(Guid id);
        Task<Negotiation> CreateAsync(Negotiation negotiation);
        Task<Negotiation?> UpdateAsync(Guid id, Negotiation negotiation);
        Task<Offer> AddOfferAsync(Offer offer);
    }
}

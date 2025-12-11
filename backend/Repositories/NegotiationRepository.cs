using Backend.Data;
using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class NegotiationRepository : INegotiationRepository
    {
        private readonly TriLinkDbContext _context;

        public NegotiationRepository(TriLinkDbContext context)
        {
            _context = context;
        }

        public async Task<List<Negotiation>> GetAllAsync(Guid? userId = null, string? role = null)
        {
            var query = _context.Negotiations
                .Include(n => n.Product)
                .Include(n => n.Buyer)
                .Include(n => n.Seller)
                .AsQueryable();

            if (userId.HasValue && !string.IsNullOrEmpty(role))
            {
                if (role.Equals("Buyer", StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(n => n.BuyerId == userId);
                }
                else if (role.Equals("Supplier", StringComparison.OrdinalIgnoreCase)) // "Supplier" or "Seller"
                {
                    query = query.Where(n => n.SellerId == userId);
                }
            }

            return await query.ToListAsync();
        }

        public async Task<Negotiation?> GetByIdAsync(Guid id)
        {
            return await _context.Negotiations
                .Include(n => n.Product)
                .Include(n => n.Buyer)
                .Include(n => n.Seller)
                .Include(n => n.Offers)
                .FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task<Negotiation> CreateAsync(Negotiation negotiation)
        {
            await _context.Negotiations.AddAsync(negotiation);
            await _context.SaveChangesAsync();
            return negotiation;
        }

        public async Task<Negotiation?> UpdateAsync(Guid id, Negotiation negotiation)
        {
            var existing = await _context.Negotiations.FirstOrDefaultAsync(n => n.Id == id);
            if (existing == null) return null;

            existing.Status = negotiation.Status;
            existing.CurrentOfferAmount = negotiation.CurrentOfferAmount;
            
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<Offer> AddOfferAsync(Offer offer)
        {
            await _context.Offers.AddAsync(offer);
            await _context.SaveChangesAsync();
            return offer;
        }
    }
}

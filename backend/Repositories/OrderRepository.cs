using Backend.Data;
using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly TriLinkDbContext _context;

        public OrderRepository(TriLinkDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<List<Order>> GetAllAsync(Guid userId, string role)
        {
             var query = _context.Orders
                .Include(o => o.Product)
                .Include(o => o.Buyer)
                .Include(o => o.Seller)
                .AsQueryable();

            if (role.Equals("Buyer", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(o => o.BuyerId == userId);
            }
            else if (role.Equals("Supplier", StringComparison.OrdinalIgnoreCase) || role.Equals("Seller", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(o => o.SellerId == userId);
            }
            // Logistics provider logic? Probably via LogisticsController, not OrderController.

            return await query.ToListAsync();
        }
    }
}

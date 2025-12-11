using Backend.Models.Domain;

namespace Backend.Repositories
{
    public interface IOrderRepository
    {
        Task<Order> CreateAsync(Order order);
        Task<List<Order>> GetAllAsync(Guid userId, string role);
    }
}

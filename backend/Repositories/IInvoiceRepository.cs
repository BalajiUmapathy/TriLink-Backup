using Backend.Models.Domain;

namespace Backend.Repositories
{
    public interface IInvoiceRepository
    {
        Task<Invoice> CreateAsync(Invoice invoice);
        Task<Invoice?> GetByIdAsync(Guid id);
        Task<Invoice?> GetByOrderIdAsync(Guid orderId);
        Task<List<Invoice>> GetBySupplierIdAsync(Guid supplierId);
        Task<List<Invoice>> GetByBuyerIdAsync(Guid buyerId);
        Task<Invoice?> UpdateAsync(Guid id, Invoice invoice);
        Task<bool> DeleteAsync(Guid id);
    }
}

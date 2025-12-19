using Backend.Data;
using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly TriLinkDbContext _context;

        public InvoiceRepository(TriLinkDbContext context)
        {
            _context = context;
        }

        public async Task<Invoice> CreateAsync(Invoice invoice)
        {
            await _context.Invoices.AddAsync(invoice);
            await _context.SaveChangesAsync();
            return invoice;
        }

        public async Task<Invoice?> GetByIdAsync(Guid id)
        {
            return await _context.Invoices
                .Include(i => i.Order)
                    .ThenInclude(o => o.Product)
                .Include(i => i.Supplier)
                .Include(i => i.Buyer)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Invoice?> GetByOrderIdAsync(Guid orderId)
        {
            return await _context.Invoices
                .Include(i => i.Order)
                    .ThenInclude(o => o.Product)
                .Include(i => i.Supplier)
                .Include(i => i.Buyer)
                .FirstOrDefaultAsync(i => i.OrderId == orderId);
        }

        public async Task<List<Invoice>> GetBySupplierIdAsync(Guid supplierId)
        {
            return await _context.Invoices
                .Include(i => i.Order)
                    .ThenInclude(o => o.Product)
                .Include(i => i.Supplier)
                .Include(i => i.Buyer)
                .Where(i => i.SupplierId == supplierId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Invoice>> GetByBuyerIdAsync(Guid buyerId)
        {
            return await _context.Invoices
                .Include(i => i.Order)
                    .ThenInclude(o => o.Product)
                .Include(i => i.Supplier)
                .Include(i => i.Buyer)
                .Where(i => i.BuyerId == buyerId && i.Status == "Finalized") // Only show finalized invoices to buyer
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<Invoice?> UpdateAsync(Guid id, Invoice invoice)
        {
            var existingInvoice = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == id);
            if (existingInvoice == null)
            {
                return null;
            }

            existingInvoice.InvoiceDate = invoice.InvoiceDate;
            existingInvoice.DueDate = invoice.DueDate;
            existingInvoice.TaxRate = invoice.TaxRate;
            existingInvoice.TaxAmount = invoice.TaxAmount;
            existingInvoice.TotalAmount = invoice.TotalAmount;
            existingInvoice.Notes = invoice.Notes;
            existingInvoice.Status = invoice.Status;
            existingInvoice.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingInvoice;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == id);
            if (invoice == null)
            {
                return false;
            }

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

using Backend.Data;
using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly TriLinkDbContext _context;

        public ProductRepository(TriLinkDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllAsync(string? filterOn = null, string? filterQuery = null)
        {
            var products = _context.Products.Include(p => p.Supplier).AsQueryable();

            if (!string.IsNullOrWhiteSpace(filterOn) && !string.IsNullOrWhiteSpace(filterQuery))
            {
                if (filterOn.Equals("Name", StringComparison.OrdinalIgnoreCase))
                {
                    products = products.Where(x => x.Name.Contains(filterQuery));
                }
                 else if (filterOn.Equals("Location", StringComparison.OrdinalIgnoreCase))
                {
                     products = products.Where(x => x.Location.Contains(filterQuery));
                }
            }

            return await products.ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            return await _context.Products.Include(p => p.Supplier).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> UpdateAsync(Guid id, Product product)
        {
            var existingProduct = await _context.Products.FirstOrDefaultAsync(x => x.Id == id);

            if (existingProduct == null)
            {
                return null;
            }

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.BasePrice = product.BasePrice;
            existingProduct.Quantity = product.Quantity;
            existingProduct.Location = product.Location;
            if (product.ImageUrl != null) existingProduct.ImageUrl = product.ImageUrl;
            
            // New Fields
            existingProduct.Category = product.Category;
            existingProduct.Unit = product.Unit;
            existingProduct.MinOrderQty = product.MinOrderQty;
            existingProduct.LeadTime = product.LeadTime;
            existingProduct.Status = product.Status;
            if (product.CertificateUrl != null) existingProduct.CertificateUrl = product.CertificateUrl;
            
            await _context.SaveChangesAsync();
            return existingProduct;
        }

        public async Task<Product?> DeleteAsync(Guid id)
        {
            var existingProduct = await _context.Products.FirstOrDefaultAsync(x => x.Id == id);

            if (existingProduct == null)
            {
                return null;
            }

            _context.Products.Remove(existingProduct);
            await _context.SaveChangesAsync();
            return existingProduct;
        }
    }
}

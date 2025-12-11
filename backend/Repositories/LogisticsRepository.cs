using Backend.Data;
using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class LogisticsRepository : ILogisticsRepository
    {
        private readonly TriLinkDbContext _context;

        public LogisticsRepository(TriLinkDbContext context)
        {
            _context = context;
        }

        public async Task<LogisticsEntry> CreateAsync(LogisticsEntry entry)
        {
            await _context.LogisticsEntries.AddAsync(entry);
            await _context.SaveChangesAsync();
            return entry;
        }

        public async Task<List<LogisticsEntry>> GetAllAsync(string? status = null)
        {
            var query = _context.LogisticsEntries
                .Include(l => l.Order)
                .ThenInclude(o => o.Product)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(l => l.Status == status);
            }

            return await query.ToListAsync();
        }

        public async Task<LogisticsEntry?> GetByIdAsync(Guid id)
        {
            return await _context.LogisticsEntries.FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<LogisticsEntry?> UpdateAsync(Guid id, LogisticsEntry entry)
        {
            var existing = await _context.LogisticsEntries.FirstOrDefaultAsync(l => l.Id == id);
            if (existing == null) return null;

            existing.Status = entry.Status;
            existing.ProviderId = entry.ProviderId;
            existing.ProposedCost = entry.ProposedCost;

            await _context.SaveChangesAsync();
            return existing;
        }
    }
}

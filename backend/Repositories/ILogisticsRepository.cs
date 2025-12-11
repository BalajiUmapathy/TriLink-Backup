using Backend.Models.Domain;

namespace Backend.Repositories
{
    public interface ILogisticsRepository
    {
        Task<LogisticsEntry> CreateAsync(LogisticsEntry entry);
        Task<List<LogisticsEntry>> GetAllAsync(string? status = null); // For providers to see opportunities
        Task<LogisticsEntry?> GetByIdAsync(Guid id);
        Task<LogisticsEntry?> UpdateAsync(Guid id, LogisticsEntry entry);
    }
}

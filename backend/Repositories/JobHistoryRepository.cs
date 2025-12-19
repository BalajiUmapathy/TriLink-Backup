using Backend.Data;
using Backend.Models;
using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class JobHistoryRepository : IJobHistoryRepository
    {
        private readonly TriLinkDbContext _context;

        public JobHistoryRepository(TriLinkDbContext context)
        {
            _context = context;
        }

        public async Task<JobHistory> CreateAsync(JobHistory jobHistory)
        {
            await _context.JobHistories.AddAsync(jobHistory);
            await _context.SaveChangesAsync();
            return jobHistory;
        }

        public async Task<List<JobHistory>> GetByLogisticsProviderAsync(Guid logisticsProviderId)
        {
            return await _context.JobHistories
                .Include(jh => jh.Job)
                .Where(jh => jh.LogisticsProviderId == logisticsProviderId)
                .OrderByDescending(jh => jh.CompletedDate)
                .ToListAsync();
        }

        public async Task<JobHistory> GetByJobIdAsync(Guid jobId)
        {
            return await _context.JobHistories
                .Include(jh => jh.Job)
                .FirstOrDefaultAsync(jh => jh.JobId == jobId);
        }

        public async Task<bool> ExistsAsync(Guid jobId)
        {
            return await _context.JobHistories.AnyAsync(jh => jh.JobId == jobId);
        }
    }
}

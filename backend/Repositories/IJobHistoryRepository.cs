using Backend.Models;
using Backend.Models.Domain;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface IJobHistoryRepository
    {
        Task<JobHistory> CreateAsync(JobHistory jobHistory);
        Task<List<JobHistory>> GetByLogisticsProviderAsync(Guid logisticsProviderId);
        Task<JobHistory> GetByJobIdAsync(Guid jobId);
        Task<bool> ExistsAsync(Guid jobId);
    }
}

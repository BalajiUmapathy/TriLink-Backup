using Backend.Data;
using Backend.Models;
using Backend.Models.Domain;
using Backend.Models.DTO;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for testing
    public class JobHistoryController : ControllerBase
    {
        private readonly IJobHistoryRepository _jobHistoryRepository;

        public JobHistoryController(IJobHistoryRepository jobHistoryRepository)
        {
            _jobHistoryRepository = jobHistoryRepository;
        }

        // GET: api/JobHistory/my-history
        [HttpGet("my-history")]
        public async Task<IActionResult> GetMyHistory([FromQuery] Guid? userId = null)
        {
            try
            {
                Guid logisticsProviderId;
                
                // Try to get from token first, then from query parameter (for testing without auth)
                var userIdFromToken = User.FindFirst("id")?.Value;
                if (!string.IsNullOrEmpty(userIdFromToken))
                {
                    logisticsProviderId = Guid.Parse(userIdFromToken);
                }
                else if (userId.HasValue)
                {
                    logisticsProviderId = userId.Value;
                }
                else
                {
                    return Unauthorized("User ID not found");
                }

                var jobHistories = await _jobHistoryRepository.GetByLogisticsProviderAsync(logisticsProviderId);

                var response = jobHistories.Select(jh => new JobHistoryDto
                {
                    Id = jh.Id,
                    JobId = jh.JobId,
                    JobReferenceId = jh.Job?.Id.ToString().Substring(0, 8).ToUpper() ?? "N/A",
                    Origin = jh.Job?.PickupCity ?? "Unknown",
                    Destination = jh.Job?.DropCity ?? "Unknown",
                    Status = jh.Status,
                    CompletedDate = jh.CompletedDate,
                    PlannedDistance = jh.PlannedDistance,
                    PlannedDuration = jh.PlannedDuration,
                    DriverExperience = jh.DriverExperience,
                    VehicleType = jh.VehicleType
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching job history: {ex.Message}");
                return StatusCode(500, "Error fetching job history");
            }
        }

        // GET: api/JobHistory/{id}/route
        [HttpGet("{id}/route")]
        public async Task<IActionResult> GetJobRoute(Guid id)
        {
            try
            {
                var jobHistory = await _jobHistoryRepository.GetByJobIdAsync(id);
                if (jobHistory == null)
                {
                    return NotFound("Job history not found");
                }

                if (jobHistory.Job == null)
                {
                    return NotFound("Related job not found");
                }

                var routeDto = new JobHistoryRouteDto
                {
                    JobId = jobHistory.Job.Id,
                    JobReferenceId = jobHistory.Job.Id.ToString().Substring(0, 8).ToUpper(),
                    PickupCity = jobHistory.Job.PickupCity,
                    PickupState = jobHistory.Job.PickupState,
                    DropCity = jobHistory.Job.DropCity,
                    DropState = jobHistory.Job.DropState,
                    PlannedDistance = jobHistory.PlannedDistance,
                    PlannedDuration = jobHistory.PlannedDuration,
                    DriverExperience = jobHistory.DriverExperience,
                    VehicleType = jobHistory.VehicleType,
                    RoutePolyline = jobHistory.Job.RoutePolyline ?? ""
                };

                return Ok(routeDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching job route: {ex.Message}");
                return StatusCode(500, "Error fetching job route");
            }
        }
    }
}

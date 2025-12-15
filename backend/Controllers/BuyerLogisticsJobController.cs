using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Backend.Data;
using Backend.Models.Domain;
using Backend.Models.DTO;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize] // Temporarily disabled for testing
    public class BuyerLogisticsJobController : ControllerBase
    {
        private readonly TriLinkDbContext _context;
        private readonly IMapper _mapper;

        public BuyerLogisticsJobController(TriLinkDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        // GET: api/BuyerLogisticsJob/available - Public endpoint for logistics providers
        [HttpGet("available")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<BuyerLogisticsJobDto>>> GetAvailableJobs()
        {
            var jobs = await _context.BuyerLogisticsJobs
                .Where(j => j.Status == "Active")
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            var jobDtos = _mapper.Map<List<BuyerLogisticsJobDto>>(jobs);
            return Ok(jobDtos);
        }

        // GET: api/BuyerLogisticsJob - Get jobs for logged-in buyer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BuyerLogisticsJobDto>>> GetAllJobs()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var jobs = await _context.BuyerLogisticsJobs
                .Include(j => j.Quotes)
                .ThenInclude(q => q.LogisticsProvider)
                .Where(j => j.BuyerId == userId)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            var jobDtos = _mapper.Map<List<BuyerLogisticsJobDto>>(jobs);
            return Ok(jobDtos);
        }

        // GET: api/BuyerLogisticsJob/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BuyerLogisticsJobDto>> GetJob(Guid id)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var job = await _context.BuyerLogisticsJobs
                .Include(j => j.Quotes)
                .FirstOrDefaultAsync(j => j.Id == id && 
                    (j.BuyerId == userId || j.Quotes.Any(q => q.LogisticsProviderId == userId)));

            if (job == null)
            {
                return NotFound();
            }

            var jobDto = _mapper.Map<BuyerLogisticsJobDto>(job);
            return Ok(jobDto);
        }

        // POST: api/BuyerLogisticsJob
        [HttpPost]
        public async Task<ActionResult<BuyerLogisticsJobDto>> CreateJob(CreateBuyerLogisticsJobDto createDto)
        {
            // Try to get user ID from token, use a default if not authenticated (for testing)
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            Guid userId;
            
            if (string.IsNullOrEmpty(userIdClaim))
            {
                // For testing without auth - use the userId from localStorage
                // In production, this should return Unauthorized
                userId = Guid.NewGuid(); // Temporary - will be replaced with actual user ID
            }
            else
            {
                userId = Guid.Parse(userIdClaim);
            }

            var job = _mapper.Map<BuyerLogisticsJob>(createDto);
            job.Id = Guid.NewGuid();
            job.BuyerId = userId;
            job.CreatedAt = DateTime.UtcNow;

            _context.BuyerLogisticsJobs.Add(job);
            await _context.SaveChangesAsync();

            var jobDto = _mapper.Map<BuyerLogisticsJobDto>(job);
            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, jobDto);
        }

        // PUT: api/BuyerLogisticsJob/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(Guid id, CreateBuyerLogisticsJobDto updateDto)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var job = await _context.BuyerLogisticsJobs
                .FirstOrDefaultAsync(j => j.Id == id && j.BuyerId == userId);

            if (job == null)
            {
                return NotFound();
            }

            _mapper.Map(updateDto, job);
            job.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/BuyerLogisticsJob/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(Guid id)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var job = await _context.BuyerLogisticsJobs
                .FirstOrDefaultAsync(j => j.Id == id && j.BuyerId == userId);

            if (job == null)
            {
                return NotFound();
            }

            _context.BuyerLogisticsJobs.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // POST: api/BuyerLogisticsJob/quote
        [HttpPost("quote")]
        public async Task<ActionResult<BuyerLogisticsJobQuoteDto>> SubmitQuote(CreateQuoteDto createQuoteDto)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var quote = _mapper.Map<BuyerLogisticsJobQuote>(createQuoteDto);
            quote.LogisticsProviderId = userId;
            quote.Status = "Pending";

            _context.BuyerLogisticsJobQuotes.Add(quote);
            await _context.SaveChangesAsync();

            // Reload to get relationships
            await _context.Entry(quote).Reference(q => q.LogisticsProvider).LoadAsync();

            var quoteDto = _mapper.Map<BuyerLogisticsJobQuoteDto>(quote);
            return CreatedAtAction(nameof(GetJob), new { id = quote.JobId }, quoteDto);
        }

        // GET: api/BuyerLogisticsJob/my-quotes
        [HttpGet("my-quotes")]
        public async Task<ActionResult<IEnumerable<BuyerLogisticsJobQuoteDto>>> GetMyQuotes()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var quotes = await _context.BuyerLogisticsJobQuotes
                .Include(q => q.LogisticsProvider)
                .Include(q => q.Job) // Include Job for Quoted Jobs page
                .Where(q => q.LogisticsProviderId == userId)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            var quoteDtos = _mapper.Map<List<BuyerLogisticsJobQuoteDto>>(quotes);
            return Ok(quoteDtos);
        }
        // POST: api/BuyerLogisticsJob/quote/{quoteId}/accept
        [HttpPost("quote/{quoteId}/accept")]
        public async Task<IActionResult> AcceptQuote(Guid quoteId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var quote = await _context.BuyerLogisticsJobQuotes
                .Include(q => q.Job)
                .ThenInclude(j => j.Quotes) // Include all quotes to reject them
                .FirstOrDefaultAsync(q => q.Id == quoteId);

            if (quote == null) return NotFound("Quote not found");

            // Verify the buyer owns the job
            if (quote.Job.BuyerId != userId)
            {
                return Unauthorized("You are not authorized to accept quotes for this job.");
            }

            if (!string.Equals(quote.Job.Status, "Active", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Job is not active and cannot accept quotes.");
            }

            // Accept this quote
            quote.Status = "Accepted";
            quote.Job.Status = "Assigned"; // Change job status

            // Reject other quotes (optional, but good for clarity)
            foreach (var otherQuote in quote.Job.Quotes.Where(q => q.Id != quoteId))
            {
                if (otherQuote.Status == "Pending")
                {
                    otherQuote.Status = "Rejected";
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Quote accepted successfully" });
        }

        // GET: api/BuyerLogisticsJob/assigned
        [HttpGet("assigned")]
        public async Task<ActionResult<IEnumerable<BuyerLogisticsJobDto>>> GetAssignedJobs()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("User ID not found in token");
            }

            // Find jobs where the user has an ACCEPTED quote, but exclude DELIVERED jobs
            // Delivered jobs should only appear in Job History, not in Assigned Jobs
            var jobs = await _context.BuyerLogisticsJobs
                .Include(j => j.Quotes)
                .Where(j => j.Quotes.Any(q => q.LogisticsProviderId == userId && q.Status == "Accepted") 
                         && j.Status != "Delivered") // Exclude delivered jobs
                .Distinct() // Ensure no duplicates
                .OrderByDescending(j => j.UpdatedAt)
                .ToListAsync();

            var jobDtos = _mapper.Map<List<BuyerLogisticsJobDto>>(jobs);
            return Ok(jobDtos);
        }
        // PUT: api/BuyerLogisticsJob/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateJobStatus(Guid id, [FromBody] string newStatus)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var job = await _context.BuyerLogisticsJobs
                .Include(j => j.Quotes)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null) return NotFound("Job not found");

            // Verify the provider is the assigned one (has an Accepted quote)
            var assignedQuote = job.Quotes.FirstOrDefault(q => q.Status == "Accepted");
            if (assignedQuote == null || assignedQuote.LogisticsProviderId != userId)
            {
                // Also allow Buyer to update? Maybe not for now.
                return Unauthorized("You are not the assigned provider for this job.");
            }

            // Improve validation
            var validStatuses = new[] { "Assigned", "Picked", "In Transit", "Delivered" };
            if (!validStatuses.Contains(newStatus))
            {
                return BadRequest("Invalid status.");
            }

            job.Status = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Job status updated successfully" });
        }
    }
}

using AutoMapper;
using Backend.Models.DTO;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Logistics")]
    public class LogisticsController : ControllerBase
    {
        private readonly ILogisticsRepository _logisticsRepository;
        private readonly IMapper _mapper;

        public LogisticsController(ILogisticsRepository logisticsRepository, IMapper mapper)
        {
            _logisticsRepository = logisticsRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetOpenRequests()
        {
            var requests = await _logisticsRepository.GetAllAsync("Open");
            return Ok(_mapper.Map<List<LogisticsDto>>(requests));
        }

        [HttpPut("{id:Guid}/assign")]
        public async Task<IActionResult> AssignRequest([FromRoute] Guid id)
        {
            var request = await _logisticsRepository.GetByIdAsync(id);
            if (request == null) return NotFound();

            if (request.Status != "Open")
            {
                return BadRequest("Request is not open");
            }

            var providerId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);

            request.ProviderId = providerId;
            request.Status = "Assigned";
            
            await _logisticsRepository.UpdateAsync(id, request);

            return Ok(_mapper.Map<LogisticsDto>(request));
        }
        
        // Maybe method to update status to "InTransit", "Delivered"
         [HttpPut("{id:Guid}/status")]
        public async Task<IActionResult> UpdateStatus([FromRoute] Guid id, [FromBody] string status) // Simple body
        {
             var request = await _logisticsRepository.GetByIdAsync(id);
            if (request == null) return NotFound();
            
             var providerId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
             if (request.ProviderId != providerId) return Forbid();

             request.Status = status;
             await _logisticsRepository.UpdateAsync(id, request);
             
             return Ok(_mapper.Map<LogisticsDto>(request));
        }
    }
}

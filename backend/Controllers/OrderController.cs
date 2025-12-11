using AutoMapper;
using Backend.Models.DTO;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public OrderController(IOrderRepository orderRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
             var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            var role = User.Claims.First(c => c.Type == System.Security.Claims.ClaimTypes.Role).Value;

            var orders = await _orderRepository.GetAllAsync(userId, role);
            return Ok(_mapper.Map<List<OrderDto>>(orders));
        }
    }
}

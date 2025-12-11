using AutoMapper;
using Backend.Models.Domain;
using Backend.Models.DTO;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NegotiationController : ControllerBase
    {
        private readonly INegotiationRepository _negotiationRepository;
        private readonly IProductRepository _productRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogisticsRepository _logisticsRepository;
        private readonly IMapper _mapper;

        public NegotiationController(
            INegotiationRepository negotiationRepository, 
            IProductRepository productRepository, 
            IOrderRepository orderRepository,
            ILogisticsRepository logisticsRepository,
            IMapper mapper)
        {
            _negotiationRepository = negotiationRepository;
            _productRepository = productRepository;
            _orderRepository = orderRepository;
            _logisticsRepository = logisticsRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> StartNegotiation([FromBody] CreateNegotiationDto createDto)
        {
            var product = await _productRepository.GetByIdAsync(createDto.ProductId);
            if (product == null) return NotFound("Product not found");

            var buyerId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);

            var negotiation = new Negotiation
            {
                Id = Guid.NewGuid(),
                ProductId = createDto.ProductId,
                BuyerId = buyerId,
                SellerId = product.SupplierId,
                Status = "Pending",
                CurrentOfferAmount = createDto.InitialOfferAmount,
                Offers = new List<Offer>
                {
                    new Offer
                    {
                        Id = Guid.NewGuid(),
                        Amount = createDto.InitialOfferAmount,
                        Message = createDto.Message,
                        CreatedAt = DateTime.Now,
                        ProposerId = buyerId
                    }
                }
            };

            await _negotiationRepository.CreateAsync(negotiation);
            return Ok(_mapper.Map<NegotiationDto>(negotiation));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            var role = User.Claims.First(c => c.Type == System.Security.Claims.ClaimTypes.Role).Value;

            var negotiations = await _negotiationRepository.GetAllAsync(userId, role);
            return Ok(_mapper.Map<List<NegotiationDto>>(negotiations));
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var negotiation = await _negotiationRepository.GetByIdAsync(id);
            if (negotiation == null) return NotFound();

            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            if (negotiation.BuyerId != userId && negotiation.SellerId != userId)
            {
                return Forbid();
            }

            return Ok(_mapper.Map<NegotiationDto>(negotiation));
        }

        [HttpPost("{id:Guid}/offers")]
        public async Task<IActionResult> AddOffer([FromRoute] Guid id, [FromBody] AddOfferDto offerDto)
        {
            var negotiation = await _negotiationRepository.GetByIdAsync(id);
            if (negotiation == null) return NotFound();

            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            if (negotiation.BuyerId != userId && negotiation.SellerId != userId)
            {
                return Forbid();
            }

            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                NegotiationId = id,
                Amount = offerDto.Amount,
                Message = offerDto.Message,
                CreatedAt = DateTime.Now,
                ProposerId = userId
            };

            await _negotiationRepository.AddOfferAsync(offer);
            
            negotiation.CurrentOfferAmount = offerDto.Amount;
            // Maybe reset status to Pending if it was rejected?
            await _negotiationRepository.UpdateAsync(id, negotiation);

            return Ok(_mapper.Map<OfferDto>(offer));
        }

        [HttpPut("{id:Guid}/status")]
        public async Task<IActionResult> UpdateStatus([FromRoute] Guid id, [FromBody] UpdateNegotiationStatusDto statusDto)
        {
            var negotiation = await _negotiationRepository.GetByIdAsync(id);
            if (negotiation == null) return NotFound();

            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            if (negotiation.BuyerId != userId && negotiation.SellerId != userId)
            {
                return Forbid();
            }

            negotiation.Status = statusDto.Status;
            await _negotiationRepository.UpdateAsync(id, negotiation);

            if (statusDto.Status.Equals("Accepted", StringComparison.OrdinalIgnoreCase))
            {
                // Create Order
                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    NegotiationId = negotiation.Id,
                    ProductId = negotiation.ProductId,
                    BuyerId = negotiation.BuyerId,
                    SellerId = negotiation.SellerId,
                    FinalPrice = negotiation.CurrentOfferAmount,
                    Status = "Confirmed",
                    CreatedAt = DateTime.Now
                };

                await _orderRepository.CreateAsync(order);

                // Create Logistics Request (Auto)
                // Simplified Logic: Use Product Location as Pickup, Buyer Location (needs to be in User entity, but I missed it. Using Dummy Drop)
                var logistics = new LogisticsEntry
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    Status = "Open",
                    PickupLocation = negotiation.Product.Location,
                    DropLocation = "Buyer Address (Placeholder)", // Should fetch from Buyer User profile
                    EstimatedDistanceKm = new Random().Next(10, 500), // Mock Route Suggestion
                    ProposedCost = 0 // Will be set by Provider
                };
                
                // Simple cost estimation logic: $1 per km
                logistics.ProposedCost = (decimal)logistics.EstimatedDistanceKm * 1.5m;

                await _logisticsRepository.CreateAsync(logistics);
            }

            return Ok(_mapper.Map<NegotiationDto>(negotiation));
        }
    }
}

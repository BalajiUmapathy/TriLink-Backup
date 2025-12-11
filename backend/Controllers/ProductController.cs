using AutoMapper;
using Backend.Models.Domain;
using Backend.Models.DTO;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductController(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? filterOn, [FromQuery] string? filterQuery)
        {
            var productsDomain = await _productRepository.GetAllAsync(filterOn, filterQuery);
            var productsDto = _mapper.Map<List<ProductResponseDto>>(productsDomain);
            return Ok(productsDto);
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var productDomain = await _productRepository.GetByIdAsync(id);

            if (productDomain == null)
            {
                return NotFound();
            }

            var productDto = _mapper.Map<ProductResponseDto>(productDomain);
            return Ok(productDto);
        }

        [HttpPost]
        [Authorize(Roles = "Supplier,supplier")]
        public async Task<IActionResult> Create([FromForm] ProductRequestDto productRequestDto)
        {
            var productDomain = _mapper.Map<Product>(productRequestDto);

            // Set SupplierId from Token if not provided or override it
            var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (userId != null)
            {
                productDomain.SupplierId = Guid.Parse(userId);
            }

            // Handle Image Upload
            if (productRequestDto.ImageFile != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productRequestDto.ImageFile.FileName);
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productRequestDto.ImageFile.CopyToAsync(stream);
                }

                var request = HttpContext.Request;
                var domain = $"{request.Scheme}://{request.Host}";
                productDomain.ImageUrl = $"{domain}/uploads/{fileName}";
            }

            // Handle Certificate Upload
            if (productRequestDto.CertificateFile != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productRequestDto.CertificateFile.FileName);
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productRequestDto.CertificateFile.CopyToAsync(stream);
                }

                var request = HttpContext.Request;
                var domain = $"{request.Scheme}://{request.Host}";
                productDomain.CertificateUrl = $"{domain}/uploads/{fileName}";
            }

            await _productRepository.CreateAsync(productDomain);
            
            var productDto = _mapper.Map<ProductResponseDto>(productDomain);

            return CreatedAtAction(nameof(GetById), new { id = productDomain.Id }, productDto);
        }

        [HttpPut("{id:Guid}")]
        [Authorize(Roles = "Supplier,supplier")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] ProductRequestDto productRequestDto)
        {
            var productDomain = _mapper.Map<Product>(productRequestDto);
            
            // Check ownership? For prototype, maybe skip. But good practice.
            // Leaving ownership check for later/refinement.

            productDomain = await _productRepository.UpdateAsync(id, productDomain);

            if (productDomain == null)
            {
                return NotFound();
            }

            var productDto = _mapper.Map<ProductResponseDto>(productDomain);
            return Ok(productDto);
        }

        [HttpDelete("{id:Guid}")]
        [Authorize(Roles = "Supplier,supplier")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var productDomain = await _productRepository.DeleteAsync(id);

            if (productDomain == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ProductResponseDto>(productDomain));
        }
    }
}

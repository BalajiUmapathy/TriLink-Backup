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
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public InvoiceController(IInvoiceRepository invoiceRepository, IOrderRepository orderRepository, IMapper mapper)
        {
            _invoiceRepository = invoiceRepository;
            _orderRepository = orderRepository;
            _mapper = mapper;
        }

        // GET: api/invoice/{id}
        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null)
                return NotFound();

            return Ok(_mapper.Map<InvoiceDto>(invoice));
        }

        // GET: api/invoice/order/{orderId}
        [HttpGet("order/{orderId:Guid}")]
        public async Task<IActionResult> GetByOrderId([FromRoute] Guid orderId)
        {
            var invoice = await _invoiceRepository.GetByOrderIdAsync(orderId);
            if (invoice == null)
                return NotFound(new { message = "No invoice found for this order" });

            return Ok(_mapper.Map<InvoiceDto>(invoice));
        }

        // GET: api/invoice/supplier/{supplierId}
        [HttpGet("supplier/{supplierId:Guid}")]
        public async Task<IActionResult> GetBySupplier([FromRoute] Guid supplierId)
        {
            var invoices = await _invoiceRepository.GetBySupplierIdAsync(supplierId);
            return Ok(_mapper.Map<List<InvoiceDto>>(invoices));
        }

        // GET: api/invoice/buyer/{buyerId}
        [HttpGet("buyer/{buyerId:Guid}")]
        public async Task<IActionResult> GetByBuyer([FromRoute] Guid buyerId)
        {
            var invoices = await _invoiceRepository.GetByBuyerIdAsync(buyerId);
            return Ok(_mapper.Map<List<InvoiceDto>>(invoices));
        }

        // POST: api/invoice
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInvoiceDto createDto)
        {
            // Get the order to validate and populate invoice data
            var order = await _orderRepository.GetByIdAsync(createDto.OrderId);
            if (order == null)
                return NotFound(new { message = "Order not found" });

            // Check if invoice already exists for this order
            var existingInvoice = await _invoiceRepository.GetByOrderIdAsync(createDto.OrderId);
            if (existingInvoice != null)
                return BadRequest(new { message = "Invoice already exists for this order" });

            // Generate invoice number
            var currentYear = DateTime.UtcNow.Year;
            var invoiceNumber = $"INV-{currentYear}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

            // Calculate tax and totals
            var taxRate = createDto.TaxRate ?? 18; // Default 18%
            var subTotal = order.FinalPrice;
            var taxAmount = Math.Round(subTotal * taxRate / 100, 2);
            var totalAmount = subTotal + taxAmount;

            var invoice = new Invoice
            {
                Id = Guid.NewGuid(),
                InvoiceNumber = invoiceNumber,
                OrderId = createDto.OrderId,
                SupplierId = order.SellerId,
                BuyerId = order.BuyerId,
                InvoiceDate = createDto.InvoiceDate ?? DateTime.UtcNow,
                DueDate = createDto.DueDate ?? DateTime.UtcNow.AddDays(30),
                SubTotal = subTotal,
                TaxRate = taxRate,
                TaxAmount = taxAmount,
                TotalAmount = totalAmount,
                Status = "Draft",
                Notes = createDto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdInvoice = await _invoiceRepository.CreateAsync(invoice);
            
            // Fetch with includes for complete data
            var fullInvoice = await _invoiceRepository.GetByIdAsync(createdInvoice.Id);
            
            return CreatedAtAction(nameof(GetById), new { id = createdInvoice.Id }, _mapper.Map<InvoiceDto>(fullInvoice));
        }

        // PUT: api/invoice/{id}
        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateInvoiceDto updateDto)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null)
                return NotFound();

            // Only allow updates to draft invoices
            if (invoice.Status != "Draft")
                return BadRequest(new { message = "Only draft invoices can be updated" });

            // Update fields
            if (updateDto.InvoiceDate.HasValue)
                invoice.InvoiceDate = updateDto.InvoiceDate.Value;

            if (updateDto.DueDate.HasValue)
                invoice.DueDate = updateDto.DueDate.Value;

            if (updateDto.TaxRate.HasValue)
            {
                invoice.TaxRate = updateDto.TaxRate.Value;
                // Recalculate tax and total
                invoice.TaxAmount = Math.Round(invoice.SubTotal * invoice.TaxRate / 100, 2);
                invoice.TotalAmount = invoice.SubTotal + invoice.TaxAmount;
            }

            if (updateDto.Notes != null)
                invoice.Notes = updateDto.Notes;

            invoice.UpdatedAt = DateTime.UtcNow;

            var updatedInvoice = await _invoiceRepository.UpdateAsync(id, invoice);
            
            // Fetch with includes for complete data
            var fullInvoice = await _invoiceRepository.GetByIdAsync(id);
            
            return Ok(_mapper.Map<InvoiceDto>(fullInvoice));
        }

        // PUT: api/invoice/{id}/finalize
        [HttpPut("{id:Guid}/finalize")]
        public async Task<IActionResult> Finalize([FromRoute] Guid id)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null)
                return NotFound();

            if (invoice.Status == "Finalized")
                return BadRequest(new { message = "Invoice is already finalized" });

            invoice.Status = "Finalized";
            invoice.UpdatedAt = DateTime.UtcNow;

            await _invoiceRepository.UpdateAsync(id, invoice);
            
            // Fetch with includes for complete data
            var fullInvoice = await _invoiceRepository.GetByIdAsync(id);
            
            return Ok(_mapper.Map<InvoiceDto>(fullInvoice));
        }

        // DELETE: api/invoice/{id}
        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null)
                return NotFound();

            // Only allow deletion of draft invoices
            if (invoice.Status != "Draft")
                return BadRequest(new { message = "Only draft invoices can be deleted" });

            var result = await _invoiceRepository.DeleteAsync(id);
            if (!result)
                return StatusCode(500, new { message = "Failed to delete invoice" });

            return NoContent();
        }
    }
}

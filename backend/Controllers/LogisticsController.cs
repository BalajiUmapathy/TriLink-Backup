using Microsoft.AspNetCore.Mvc;
using TriLink.DTOs;
using TriLink.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogisticsController : ControllerBase
    {
        private readonly IRouteService _routeService;
        private readonly IAIService _aiService;
        private readonly ILogger<LogisticsController> _logger;

        public LogisticsController(IRouteService routeService, IAIService aiService, ILogger<LogisticsController> logger)
        {
            _routeService = routeService;
            _aiService = aiService;
            _logger = logger;
        }

        [HttpPost("suggest-route")]
        public async Task<ActionResult<RouteResponseDto>> SuggestRoute([FromBody] RouteRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Origin) || string.IsNullOrEmpty(request.Destination))
            {
                return BadRequest("Origin and Destination are required.");
            }

            _logger.LogInformation($"Getting route for {request.Origin} to {request.Destination}");

            // 1. Geocode Origin and Destination
            var originCoords = await _routeService.GeocodeAsync(request.Origin);
            var destCoords = await _routeService.GeocodeAsync(request.Destination);

            if (originCoords == null || destCoords == null)
            {
                return NotFound("Could not find coordinates for one or both locations.");
            }

            // 2. Get Route from OSRM
            var route = await _routeService.GetRouteAsync(
                originCoords.Value.lat, originCoords.Value.lon,
                destCoords.Value.lat, destCoords.Value.lon);

            if (route == null)
            {
                return StatusCode(500, "Could not calculate route.");
            }

            // 3. Get AI Suggestions (includes calculated Fuel Cost based on vehicle)
            var (experience, vehicle, fuelCost) = _aiService.GetSuggestions(request.Origin, request.Destination, route.Value.distanceKm);

            // 4. Construct Response
            var response = new RouteResponseDto
            {
                Distance = $"{route.Value.distanceKm:F0} km",
                Duration = $"{route.Value.durationHours:F0} hr",
                FuelCost = $"₹{fuelCost:F0}",
                DriverExperience = experience,
                VehicleType = vehicle,
                RouteGeometry = route.Value.geometry ?? "",
                OriginCoords = new double[] { originCoords.Value.lat, originCoords.Value.lon },
                DestinationCoords = new double[] { destCoords.Value.lat, destCoords.Value.lon }
            };

            return Ok(response);
        }
    }
}

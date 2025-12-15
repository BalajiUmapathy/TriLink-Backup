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

            // 1. Geocode Origin and Destination (with fallback)
            var originCoords = await _routeService.GeocodeAsync(request.Origin, request.OriginCity);
            var destCoords = await _routeService.GeocodeAsync(request.Destination, request.DestinationCity);

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
                Duration = FormatDuration(route.Value.durationHours),
                FuelCost = $"₹{fuelCost:F0}",
                DriverExperience = experience,
                VehicleType = vehicle,
                RouteGeometry = route.Value.geometry ?? "",
                OriginCoords = new double[] { originCoords.Value.lat, originCoords.Value.lon },
                DestinationCoords = new double[] { destCoords.Value.lat, destCoords.Value.lon }
            };

            return Ok(response);
        }

        private string FormatDuration(double hours)
        {
            int wholeHours = (int)hours;
            int minutes = (int)((hours - wholeHours) * 60);
            
            if (wholeHours > 0 && minutes > 0)
                return $"{wholeHours} hr {minutes} min";
            else if (wholeHours > 0)
                return $"{wholeHours} hr";
            else
                return $"{minutes} min";
        }
    }
}

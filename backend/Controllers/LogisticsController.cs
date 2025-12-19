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
        private readonly ITransportCostService _costService;
        private readonly ILogger<LogisticsController> _logger;

        public LogisticsController(IRouteService routeService, ITransportCostService costService, ILogger<LogisticsController> logger)
        {
            _routeService = routeService;
            _costService = costService;
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

            // 2. Get Route from Google Maps
            var route = await _routeService.GetRouteAsync(
                originCoords.Value.lat, originCoords.Value.lon,
                destCoords.Value.lat, destCoords.Value.lon);

            if (route == null)
            {
                return StatusCode(500, "Could not calculate route.");
            }

            // 3. Calculate Transport Costs using physics-based model
            var breakdown = _costService.CalculateCost(
                distanceKm: route.Value.distanceKm,
                durationHours: route.Value.durationHours,
                totalWeight: request.TotalWeight ?? 1000m, // Default 1000kg if not provided
                length: request.Length,
                width: request.Width,
                height: request.Height,
                isFragile: request.IsFragile ?? false,
                isHighValue: request.IsHighValue ?? false,
                pickupCity: request.OriginCity ?? request.Origin ?? "",
                dropCity: request.DestinationCity ?? request.Destination ?? ""
            );

            // 4. Construct Response with cost breakdown
            var response = new RouteResponseDto
            {
                Distance = $"{route.Value.distanceKm:F0} km",
                Duration = FormatDuration(route.Value.durationHours),
                FuelCost = $"₹{breakdown.TotalCost:F0}",
                DriverExperience = GetDriverExperience(breakdown.VehicleType),
                VehicleType = breakdown.VehicleType,
                RouteGeometry = route.Value.geometry ?? "",
                OriginCoords = new double[] { originCoords.Value.lat, originCoords.Value.lon },
                DestinationCoords = new double[] { destCoords.Value.lat, destCoords.Value.lon },
                CostBreakdown = new CostBreakdownDto
                {
                    VehicleType = breakdown.VehicleType,
                    ChargeableWeightKg = breakdown.ChargeableWeightKg,
                    ActualWeightKg = breakdown.ActualWeightKg,
                    VolumetricWeightKg = breakdown.VolumetricWeightKg,
                    FuelCost = breakdown.FuelCost,
                    FuelLiters = breakdown.FuelLiters,
                    DriverCost = breakdown.DriverCost,
                    TollCost = breakdown.TollCost,
                    MaintenanceCost = breakdown.MaintenanceCost,
                    InsuranceCost = breakdown.InsuranceCost,
                    OverheadCost = breakdown.OverheadCost,
                    TotalCost = breakdown.TotalCost,
                    TerrainType = breakdown.TerrainType,
                    LoadFactor = breakdown.LoadFactor
                }
            };

            return Ok(response);
        }

        private string GetDriverExperience(string vehicleType)
        {
            return vehicleType switch
            {
                "Light Commercial Vehicle" => "City Delivery Associate",
                "Medium Goods Vehicle" => "Regional Logistics Driver",
                "Heavy Duty Truck" => "Highway Expert",
                "Multi-Axle Trailer" => "Long Haul Specialist",
                "4x4 Cargo Truck" => "Mountain Terrain Specialist",
                _ => "Experienced Driver"
            };
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


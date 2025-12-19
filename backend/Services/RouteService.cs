using System.Text.Json;
using System.Net.Http.Json;

namespace TriLink.Services
{
    public interface IRouteService
    {
        Task<(double lat, double lon)?> GeocodeAsync(string location, string? fallback = null);
        Task<(double distanceKm, double durationHours, string? geometry)?> GetRouteAsync(double lat1, double lon1, double lat2, double lon2);
    }

    public class RouteService : IRouteService
    {
        private readonly IGoogleMapsService _googleMapsService;

        private readonly Dictionary<string, (double lat, double lon)> _fallbackCoordinates = new(StringComparer.OrdinalIgnoreCase)
        {
            { "Chennai", (13.0827, 80.2707) },
            { "Tambaram", (12.9229, 80.1275) },
            { "Coimbatore", (11.0168, 76.9558) },
            { "Bangalore", (12.9716, 77.5946) },
            { "Bengaluru", (12.9716, 77.5946) },
            { "Mumbai", (19.0760, 72.8777) },
            { "Delhi", (28.7041, 77.1025) },
            { "New Delhi", (28.6139, 77.2090) },
            { "Hyderabad", (17.3850, 78.4867) },
            { "Kolkata", (22.5726, 88.3639) },
            { "Pune", (18.5204, 73.8567) },
            { "Cochin", (9.9312, 76.2673) },
            { "Kochi", (9.9312, 76.2673) },
            { "Madurai", (9.9252, 78.1198) },
            { "Salem", (11.6643, 78.1460) },
            { "Trichy", (10.7905, 78.7047) },
            { "Tiruchirappalli", (10.7905, 78.7047) },
            // Common Typos / Variations
            { "Combatore", (11.0168, 76.9558) }, 
            { "Chenai", (13.0827, 80.2707) },
            { "Banglore", (12.9716, 77.5946) }
        };

        public RouteService(IGoogleMapsService googleMapsService)
        {
            _googleMapsService = googleMapsService;
        }

        public async Task<(double lat, double lon)?> GeocodeAsync(string location, string? fallback = null)
        {
            Console.WriteLine($"[RouteService] Geocoding: '{location}', Fallback: '{fallback}'");

            // Try Google Maps Geocoding first
            var result = await _googleMapsService.GeocodeAsync(location);
            if (result != null)
            {
                Console.WriteLine($"[RouteService] Google Maps geocoded '{location}' successfully");
                return result;
            }

            // Try explicit fallback city
            if (!string.IsNullOrEmpty(fallback))
            {
                Console.WriteLine($"[RouteService] Trying explicit fallback: '{fallback}'");
                result = await _googleMapsService.GeocodeAsync(fallback);
                if (result != null) return result;

                // Offline fallback for explicit city
                if (_fallbackCoordinates.TryGetValue(fallback, out var coords))
                {
                    Console.WriteLine($"[RouteService] Using offline fallback for '{fallback}'");
                    return coords;
                }
            }

            // Try parsing location to find a known city
            if (location.Contains(","))
            {
                var parts = location.Split(',').Select(p => p.Trim()).Where(p => !string.IsNullOrEmpty(p)).ToArray();
                
                // Try last part (usually city)
                if (parts.Length > 0)
                {
                    var lastPart = parts[parts.Length - 1];
                    if (_fallbackCoordinates.TryGetValue(lastPart, out var coords))
                    {
                        Console.WriteLine($"[RouteService] Using offline fallback for city '{lastPart}'");
                        return coords;
                    }
                }
            }

            // Final attempt: check if any known city is mentioned in the location string
            foreach (var key in _fallbackCoordinates.Keys)
            {
                if (location.Contains(key, StringComparison.OrdinalIgnoreCase))
                {
                    Console.WriteLine($"[RouteService] Using offline fallback for fuzzy match '{key}'");
                    return _fallbackCoordinates[key];
                }
            }

            Console.WriteLine($"[RouteService] FAILED to geocode '{location}'");
            return null;
        }

        public async Task<(double distanceKm, double durationHours, string? geometry)?> GetRouteAsync(double lat1, double lon1, double lat2, double lon2)
        {
            Console.WriteLine($"[RouteService] Getting route from ({lat1}, {lon1}) to ({lat2}, {lon2})");

            // Try Google Maps Directions API
            var result = await _googleMapsService.GetDirectionsAsync(lat1, lon1, lat2, lon2);
            
            if (result != null)
            {
                Console.WriteLine($"[RouteService] Google Maps returned route: {result.Value.distanceKm:F2} km, {result.Value.durationHours:F2} hours");
                return result;
            }

            // Fallback: Calculate straight-line distance with road factor
            Console.WriteLine("[RouteService] Google Maps failed, using Haversine fallback");
            double straightLineDist = CalculateHaversineDistance(lat1, lon1, lat2, lon2);
            double estimatedRoadDist = straightLineDist * 1.3; // Road factor
            double estimatedDuration = estimatedRoadDist / 60.0; // Assume 60 km/h avg speed

            // Create a simple fallback polyline (straight line)
            var fallbackPolyline = PolyLineEncoder.Encode(new List<(double, double)>
            {
                (lat1, lon1),
                (lat2, lon2)
            });

            return (estimatedRoadDist, estimatedDuration, fallbackPolyline);
        }

        private double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371; // Radius of the earth in km
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);
            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;
        }

        private double ToRadians(double deg)
        {
            return deg * (Math.PI / 180);
        }
    }
}

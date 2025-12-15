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
        private readonly HttpClient _httpClient;

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

        public RouteService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "TriLinkApp/1.0 (contact@trilink.app)"); // Compliance
            _httpClient.Timeout = TimeSpan.FromSeconds(30); // Global timeout
        }

        public async Task<(double lat, double lon)?> GeocodeAsync(string location, string? fallback = null)
        {
            Console.WriteLine($"[GeocodeAsync] Request: '{location}', Fallback: '{fallback}'");

            // 1. Try exact match
            var result = await InternalGeocodeAsync(location);
            if (result != null) 
            {
                Console.WriteLine($"[GeocodeAsync] Exact match found for '{location}'");
                return result;
            }

            // 1b. Try finding a Zip Code (6 digits)
            var zipMatch = System.Text.RegularExpressions.Regex.Match(location, @"\b\d{6}\b");
            if (zipMatch.Success) 
            {
                Console.WriteLine($"[GeocodeAsync] Zip code found: {zipMatch.Value}");
                result = await InternalGeocodeAsync(zipMatch.Value);
                if (result != null) return result;
            }

            // 2. Fallback: Parse comma separated values to find a valid city/region
            if (location.Contains(",")) 
            {
                var parts = location.Split(',').Select(p => p.Trim()).Where(p => !string.IsNullOrEmpty(p)).ToArray();
                
                // Try Last part (City/Country)
                if (parts.Length > 0)
                {
                    var lastPart = parts[parts.Length - 1];
                    Console.WriteLine($"[GeocodeAsync] Trying last part: '{lastPart}'");
                    result = await InternalGeocodeAsync(lastPart);
                    if (result != null) return result;
                    
                    // Offline Fallback for City Part
                    if (_fallbackCoordinates.TryGetValue(lastPart, out var coords)) 
                    {
                         Console.WriteLine($"[GeocodeAsync] Offline fallback found for '{lastPart}'");
                         return coords;
                    }
                }

                // Try Last 2 parts
                if (parts.Length >= 2)
                {
                    var lastTwo = $"{parts[parts.Length - 2]}, {parts[parts.Length - 1]}";
                    Console.WriteLine($"[GeocodeAsync] Trying last two parts: '{lastTwo}'");
                    result = await InternalGeocodeAsync(lastTwo);
                    if (result != null) return result;
                }
            }

            // 3. Explicit Fallback (e.g. City Name provided by caller)
            if (!string.IsNullOrEmpty(fallback))
            {
                Console.WriteLine($"[GeocodeAsync] Trying explicit fallback: '{fallback}'");
                result = await InternalGeocodeAsync(fallback);
                if (result != null) return result;

                // Offline Fallback for Explicit City
                if (_fallbackCoordinates.TryGetValue(fallback, out var coords))
                {
                    Console.WriteLine($"[GeocodeAsync] Offline fallback found for explicit city '{fallback}'");
                    return coords;
                }
            }
            
            // 4. Final attempt: Check if any part of the location string matches our offline list
            foreach (var key in _fallbackCoordinates.Keys)
            {
                if (location.Contains(key, StringComparison.OrdinalIgnoreCase))
                {
                    Console.WriteLine($"[GeocodeAsync] Final fuzzy match found for '{key}' in '{location}'");
                    return _fallbackCoordinates[key];
                }
            }

            Console.WriteLine($"[GeocodeAsync] FAILED to resolve '{location}'");
            return null;
        }

        private async Task<(double lat, double lon)?> InternalGeocodeAsync(string location)
        {
            try
            {
                // Respect Nominatim Usage Policy
                await Task.Delay(1100); 

                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                var response = await _httpClient.GetFromJsonAsync<JsonElement[]>($"https://nominatim.openstreetmap.org/search?q={Uri.EscapeDataString(location)}&format=json&limit=1", cts.Token);
                
                if (response != null && response.Length > 0)
                {
                    var first = response[0];
                    if (double.TryParse(first.GetProperty("lat").GetString(), out double lat) && 
                        double.TryParse(first.GetProperty("lon").GetString(), out double lon))
                    {
                        return (lat, lon);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Geocoding error for '{location}': {ex.Message}");
            }
            return null;
        }

        public async Task<(double distanceKm, double durationHours, string? geometry)?> GetRouteAsync(double lat1, double lon1, double lat2, double lon2)
        {
            int maxRetries = 2; // Allow 1 retry for transient network issues
            for (int i = 0; i < maxRetries; i++)
            {
                try
                {
                    // OSRM expects lon,lat
                    string url = $"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=simplified";
                    
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30)); // 30s Timeout for long routes
                    var response = await _httpClient.GetFromJsonAsync<JsonElement>(url, cts.Token);

                    if (response.TryGetProperty("routes", out var routes) && routes.GetArrayLength() > 0)
                    {
                        var route = routes[0];
                        double distanceMeters = route.GetProperty("distance").GetDouble();
                        double durationSeconds = route.GetProperty("duration").GetDouble();
                        string geometry = route.GetProperty("geometry").GetString();

                        return (distanceMeters / 1000.0, durationSeconds / 3600.0, geometry);
                    }
                }
                catch (Exception ex)
                {
                    if (i < maxRetries - 1)
                    {
                        Console.WriteLine($"OSRM attempt {i + 1} failed: {ex.Message}. Retrying...");
                        await Task.Delay(1000 * (i + 1)); // Backoff: 1s, 2s, ...
                        continue;
                    }

                    Console.WriteLine($"Routing error (OSRM failed after {maxRetries} attempts): {ex.Message}. Using fallback calculation.");
                    
                    // Fallback: Haversine Distance * 1.3 (Road Factor)
                    double straightLineDist = CalculateHaversineDistance(lat1, lon1, lat2, lon2);
                    double estimatedRoadDist = straightLineDist * 1.3;
                    double estimatedDuration = estimatedRoadDist / 60.0; // Assume 60 km/h avg speed

                    return (estimatedRoadDist, estimatedDuration, null);
                }
            }
            return null;
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

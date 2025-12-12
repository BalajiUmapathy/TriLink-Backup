using System.Text.Json;
using System.Net.Http.Json;

namespace TriLink.Services
{
    public interface IRouteService
    {
        Task<(double lat, double lon)?> GeocodeAsync(string location);
        Task<(double distanceKm, double durationHours, string? geometry)?> GetRouteAsync(double lat1, double lon1, double lat2, double lon2);
    }

    public class RouteService : IRouteService
    {
        private readonly HttpClient _httpClient;

        public RouteService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "TriLinkApp/1.0");
        }

        public async Task<(double lat, double lon)?> GeocodeAsync(string location)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<JsonElement[]>($"https://nominatim.openstreetmap.org/search?q={Uri.EscapeDataString(location)}&format=json&limit=1");
                
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
                Console.WriteLine($"Geocoding error: {ex.Message}");
            }
            return null;
        }

        public async Task<(double distanceKm, double durationHours, string? geometry)?> GetRouteAsync(double lat1, double lon1, double lat2, double lon2)
        {
            int maxRetries = 3;
            for (int i = 0; i < maxRetries; i++)
            {
                try
                {
                    // OSRM expects lon,lat
                    string url = $"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=simplified";
                    var response = await _httpClient.GetFromJsonAsync<JsonElement>(url);

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

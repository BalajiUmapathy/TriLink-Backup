using System.Text.Json;
using System.Net.Http.Json;

namespace TriLink.Services
{
    public interface IGoogleMapsService
    {
        Task<(double lat, double lon)?> GeocodeAsync(string address);
        Task<(double distanceKm, double durationHours, string? encodedPolyline)?> GetDirectionsAsync(double originLat, double originLon, double destLat, double destLon);
    }

    public class GoogleMapsService : IGoogleMapsService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GoogleMapsService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["GoogleMaps:ApiKey"] ?? throw new ArgumentException("Google Maps API Key not configured");
            _httpClient.Timeout = TimeSpan.FromSeconds(30);
        }

        /// <summary>
        /// Geocodes an address using Google Geocoding API
        /// </summary>
        public async Task<(double lat, double lon)?> GeocodeAsync(string address)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(address))
                    return null;

                string url = $"https://maps.googleapis.com/maps/api/geocode/json?address={Uri.EscapeDataString(address)}&key={_apiKey}";
                
                var response = await _httpClient.GetFromJsonAsync<JsonElement>(url);

                if (response.TryGetProperty("status", out var status) && status.GetString() == "OK")
                {
                    if (response.TryGetProperty("results", out var results) && results.GetArrayLength() > 0)
                    {
                        var location = results[0].GetProperty("geometry").GetProperty("location");
                        double lat = location.GetProperty("lat").GetDouble();
                        double lng = location.GetProperty("lng").GetDouble();
                        
                        Console.WriteLine($"[GoogleMaps] Geocoded '{address}' -> ({lat}, {lng})");
                        return (lat, lng);
                    }
                }
                else
                {
                    var statusMsg = status.GetString();
                    Console.WriteLine($"[GoogleMaps] Geocoding failed for '{address}': {statusMsg}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GoogleMaps] Geocoding error for '{address}': {ex.Message}");
            }

            return null;
        }

        /// <summary>
        /// Gets directions between two coordinates using Google Directions API
        /// </summary>
        public async Task<(double distanceKm, double durationHours, string? encodedPolyline)?> GetDirectionsAsync(
            double originLat, double originLon, double destLat, double destLon)
        {
            try
            {
                string origin = $"{originLat},{originLon}";
                string destination = $"{destLat},{destLon}";
                string url = $"https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&key={_apiKey}";

                var response = await _httpClient.GetFromJsonAsync<JsonElement>(url);

                if (response.TryGetProperty("status", out var status) && status.GetString() == "OK")
                {
                    if (response.TryGetProperty("routes", out var routes) && routes.GetArrayLength() > 0)
                    {
                        var route = routes[0];
                        
                        // Extract total distance and duration from all legs
                        double totalDistanceMeters = 0;
                        double totalDurationSeconds = 0;
                        
                        if (route.TryGetProperty("legs", out var legs))
                        {
                            foreach (var leg in legs.EnumerateArray())
                            {
                                totalDistanceMeters += leg.GetProperty("distance").GetProperty("value").GetDouble();
                                totalDurationSeconds += leg.GetProperty("duration").GetProperty("value").GetDouble();
                            }
                        }

                        // Extract encoded polyline
                        string? polyline = null;
                        if (route.TryGetProperty("overview_polyline", out var overviewPolyline))
                        {
                            polyline = overviewPolyline.GetProperty("points").GetString();
                        }

                        double distanceKm = totalDistanceMeters / 1000.0;
                        double durationHours = totalDurationSeconds / 3600.0;

                        Console.WriteLine($"[GoogleMaps] Directions: {distanceKm:F2} km, {durationHours:F2} hours");
                        return (distanceKm, durationHours, polyline);
                    }
                }
                else
                {
                    var statusMsg = status.GetString();
                    Console.WriteLine($"[GoogleMaps] Directions failed: {statusMsg}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GoogleMaps] Directions error: {ex.Message}");
            }

            return null;
        }
    }
}

namespace TriLink.Services
{
    public interface IAIService
    {
        (string experience, string vehicle, double fuelCost) GetSuggestions(string origin, string destination, double distanceKm);
    }

    public class AIService : IAIService
    {
        public (string experience, string vehicle, double fuelCost) GetSuggestions(string origin, string destination, double distanceKm)
        {
            // Heuristic-based logic
            string experience = "Intermediate";
            string vehicle = "Mini Truck";
            double ratePerKm = 18.0; // Base rate for Mini Truck

            if (distanceKm > 500)
            {
                vehicle = "Heavy Duty Truck";
                experience = "5+ Years";
                ratePerKm = 35.0; // Higher rate for Heavy Truck
            }
            
            var mountainKeywords = new[] { "Ooty", "Manali", "Shimla", "Munnar", "Kodaikanal" };
            bool isMountain = mountainKeywords.Any(k => origin.Contains(k, StringComparison.OrdinalIgnoreCase) || destination.Contains(k, StringComparison.OrdinalIgnoreCase));

            // Dynamic determination based on route characteristics
            // Dynamic determination based on route characteristics
            if (isMountain)
            {
                experience = "Mountain Terrain Specialist";
                vehicle = "4x4 Cargo Truck";
                ratePerKm = 50.0; // Premium rate + specialized vehicle
            }
            else if (distanceKm > 500)
            {
                experience = "Long Haul Specialist";
                vehicle = "Multi-Axle Container Trailer"; // For interstate hauls (Chennai-Delhi)
                ratePerKm = 45.0;
            }
            else if (distanceKm > 150)
            {
                experience = "Highway Expert";
                vehicle = "Heavy Duty Truck";
                ratePerKm = 35.0;
            }
            else if (distanceKm > 40)
            {
                experience = "Regional Logistics Driver";
                vehicle = "Medium Goods Vehicle (MGV)";
                ratePerKm = 25.0;
            }
            else
            {
                experience = "City Delivery Associate";
                vehicle = "Light Commercial Vehicle (LCV)";
                ratePerKm = 18.0;
            }

            double fuelCost = distanceKm * ratePerKm;

            return (experience, vehicle, fuelCost);
        }
    }
}

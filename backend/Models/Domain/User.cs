using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }

        // New Company Information Fields
        public string? CompanyName { get; set; }
        public string? GSTNumber { get; set; }
        public string? PANNumber { get; set; }
        public string? ContactPerson { get; set; }
        public string? ContactNumber { get; set; }
        public string? Address { get; set; }
        
        // Document URLs
        public string? GSTCertificateUrl { get; set; }
        public string? PANCardUrl { get; set; } // "Supplier", "Buyer", "Logistics"
    }
}

using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public class UserProfileDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string? CompanyName { get; set; }
        public string? GSTNumber { get; set; }
        public string? PANNumber { get; set; }
        public string? ContactPerson { get; set; }
        public string? ContactNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? GSTCertificatePath { get; set; }
        public string? PANCardPath { get; set; }
    }

    public class UpdateProfileDto
    {
        public string? CompanyName { get; set; }
        public string? ContactPerson { get; set; }
        public string? ContactNumber { get; set; }
        public string? AddressLine1 { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public class LoginRequestDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }

    public class RegisterRequestDto
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public string Role { get; set; } // "Supplier", "Buyer", "Logistics"
        
        // New Company Information Fields
        public string? CompanyName { get; set; }
        public string? GSTNumber { get; set; }
        public string? PANNumber { get; set; }
        public string? ContactPerson { get; set; }
        public string? ContactNumber { get; set; }
        public string? Address { get; set; }
        public string? GSTCertificateUrl { get; set; }
        public string? PANCardUrl { get; set; }

        public Microsoft.AspNetCore.Http.IFormFile? GSTCertificateFile { get; set; }
        public Microsoft.AspNetCore.Http.IFormFile? PANCardFile { get; set; }
    }

    public class LoginResponseDto
    {
        public string JwtToken { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace TriLink.DTOs
{
    public class CreateLogisticsJobDto
    {
        public Guid ? OrderId { get; set; }

        [Required]
        public string PickupAddressLine1 { get; set; } = null!;
        public string? PickupAddressLine2 { get; set; }
        [Required]
        public string PickupCity { get; set; } = null!;
        [Required]
        public string PickupState { get; set; } = null!;
        [Required]
        public string PickupPincode { get; set; } = null!;

        [Required]
        public string DropAddressLine1 { get; set; } = null!;
        public string? DropAddressLine2 { get; set; }
        [Required]
        public string DropCity { get; set; } = null!;
        [Required]
        public string DropState { get; set; } = null!;
        [Required]
        public string DropPincode { get; set; } = null!;

        public decimal EstimatedWeightKg { get; set; }
        public string Status { get; set; } = "Active";
    }

    public class LogisticsJobDto
    {
        public Guid Id { get; set; }
        public Guid? OrderId { get; set; }
        public string PickupLocation { get; set; } = null!; // City, State
        public string DropLocation { get; set; } = null!;   // City, State
        public decimal EstimatedWeightKg { get; set; }
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}

namespace Backend.Models.DTO
{
    public class JobHistoryDto
    {
        public Guid Id { get; set; }
        public Guid JobId { get; set; }
        public string JobReferenceId { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string Status { get; set; }
        public DateTime CompletedDate { get; set; }
        public string PlannedDistance { get; set; }
        public string PlannedDuration { get; set; }
        public string DriverExperience { get; set; }
        public string VehicleType { get; set; }
    }
}

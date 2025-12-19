namespace Backend.Models.DTO
{
    public class JobHistoryRouteDto
    {
        public Guid JobId { get; set; }
        public string JobReferenceId { get; set; }
        public string PickupCity { get; set; }
        public string PickupState { get; set; }
        public string DropCity { get; set; }
        public string DropState { get; set; }
        public string PlannedDistance { get; set; }
        public string PlannedDuration { get; set; }
        public string DriverExperience { get; set; }
        public string VehicleType { get; set; }
        public string RoutePolyline { get; set; }
    }
}

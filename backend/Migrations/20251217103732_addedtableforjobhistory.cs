using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class addedtableforjobhistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PlannedDistance",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PlannedDriverExperience",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PlannedDuration",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PlannedVehicleType",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "RoutePlannedAt",
                table: "BuyerLogisticsJobs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoutePolyline",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "JobHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JobId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LogisticsProviderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlannedDistance = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlannedDuration = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DriverExperience = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VehicleType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobHistories_BuyerLogisticsJobs_JobId",
                        column: x => x.JobId,
                        principalTable: "BuyerLogisticsJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobHistories_JobId",
                table: "JobHistories",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_JobHistories_LogisticsProviderId",
                table: "JobHistories",
                column: "LogisticsProviderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobHistories");

            migrationBuilder.DropColumn(
                name: "PlannedDistance",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "PlannedDriverExperience",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "PlannedDuration",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "PlannedVehicleType",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "RoutePlannedAt",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "RoutePolyline",
                table: "BuyerLogisticsJobs");
        }
    }
}

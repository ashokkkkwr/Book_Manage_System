using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BasicCrud.Migrations
{
    /// <inheritdoc />
    public partial class newcommit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dec406ea-1bd1-4ab6-94b3-0efce668f8cf",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "7b74f131-7453-4cbd-b9bc-ec87139aeb3c", "AQAAAAIAAYagAAAAEKsNWvMvRK8PWFQzYLaTD0Nwf9G5vunUDMNLQESU+VqL23AORIsPG+jHHVoP5M20Mw==", "defe6f92-9b52-40ff-a56b-e01fb0afce1e" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dec406ea-1bd1-4ab6-94b3-0efce668f8cf",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "dcac33ee-0483-4136-bc47-e4e195330ae8", "AQAAAAIAAYagAAAAEDbC2LfICVbPTJRg+mJiO/pjCny2E0AysDHNaXUTrAqKrB4SDDuM3Ptd6zUoyCnU0Q==", "458ddc8f-7f14-43cb-a723-da966f58e9b7" });
        }
    }
}

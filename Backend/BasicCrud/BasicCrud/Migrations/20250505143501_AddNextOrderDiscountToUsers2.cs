using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BasicCrud.Migrations
{
    /// <inheritdoc />
    public partial class AddNextOrderDiscountToUsers2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dec406ea-1bd1-4ab6-94b3-0efce668f8cf",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c558f871-b902-4aae-948e-990154d9fb38", "AQAAAAIAAYagAAAAEDE9TJyVvr2f7bWmLjlzQRLldoSSFDY9YDUNiA+Fi5EdAVarTOZNCv50jUJEGty+uw==", "e41c0da7-18a2-49f5-ba58-553860714753" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dec406ea-1bd1-4ab6-94b3-0efce668f8cf",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c8c14be3-2734-4281-a517-9f3c491fde9b", "AQAAAAIAAYagAAAAEGYBxRuQSOplUbLmPpiPDrxjKxWwkLaDcLTd5jK6SOmoVV7wA8PK3PsHfISCtv8aaQ==", "1a273836-e229-4ec6-86c4-bad98917e73e" });
        }
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BasicCrud.Configuration
{
    public class UpdateRoleConfiguration : IEntityTypeConfiguration<IdentityUserRole<string>>
    {
        public void Configure(EntityTypeBuilder<IdentityUserRole<string>> builder)
        {
            builder.HasData(

                new IdentityUserRole<string>
                {
                    UserId = "dec406ea-1bd1-4ab6-94b3-0efce668f8cf",
                    RoleId = "644aa6e7-45aa-4b6a-bb4c-8d4e33f7987a",
                }

                );
        }
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BasicCrud.Configuration
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData(

                new IdentityRole
                {
                    Id = "644aa6e7-45aa-4b6a-bb4c-8d4e33f7987a",
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Id = "480788d7-b903-4fc9-84ce-c6be1d183bfc",
                    Name = "Staff",
                    NormalizedName = "STAFF"
                },

                new IdentityRole
                {
                    Id = "5c30268a-8dff-40c6-8649-17551da6e681",
                    Name = "Member",
                    NormalizedName = "MEMBER"
                });
        }
    }
}

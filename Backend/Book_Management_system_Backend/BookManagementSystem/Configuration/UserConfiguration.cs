using BasicCrud.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BasicCrud.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {

            var hasher = new PasswordHasher<ApplicationUser>();
            builder.HasData(

                new ApplicationUser
                {
                    Id = "dec406ea-1bd1-4ab6-94b3-0efce668f8cf",
                    UserName = "Admin",
                    NormalizedUserName = "ADMIN",
                    FullName = "Admin",
                    Email = "aayushadhikari601@gmail.com",
                    NormalizedEmail = "AAYUSHADHIKARI601@GMAIL.COM",
                    EmailConfirmed = true,  
                    PasswordHash = hasher.HashPassword(null, "Admin@123") ,
                    PhoneNumber = "9876543210",
                  

                });
             builder.HasKey(x => x.Id); 

        }
    }
}

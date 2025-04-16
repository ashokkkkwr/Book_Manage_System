using System.Reflection.Emit;
using BasicCrud.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BasicCrud.DbContext
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options ) : base( options ) 
        {
        
        }
        public DbSet<ApplicationUser> Users { get; set; }

        // DbSets for each table
        public DbSet<Publisher> Publishers { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookAuthor> BookAuthors { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<BookGenre> BookGenres { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);



            // Configure composite keys for join tables.
            builder.Entity<BookAuthor>()
                .HasKey(ba => new { ba.BookId, ba.AuthorId });

            builder.Entity<BookGenre>()
                .HasKey(bg => new { bg.BookId, bg.GenreId });

            builder.Entity<Review>()
                .Property(r => r.Rating)
                .HasConversion<int>()
                .HasDefaultValue(1)
                .IsRequired();

            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly); 
        }



        //public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        //{
        //    foreach (var entity in ChangeTracker.Entries<ApplicationUser>()
        //        .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
        //    {
        //        entity.Entity.UpdatedAt = DateTime.UtcNow;

        //        if (entity.State == EntityState.Added)
        //        {
        //            entity.Entity.CreatedAt = DateTime.UtcNow;
        //        }
        //    }

        //    return await base.SaveChangesAsync(cancellationToken);
        //}

    }
}
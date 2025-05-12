using BasicCrud.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BasicCrud.DbContext
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Publisher> Publishers { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<BookAuthor> BookAuthors { get; set; }

        public DbSet<Genre> Genres { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<BookGenre> BookGenres { get; set; }

        public DbSet<Bookmark> Bookmarks { get; set; }
        public DbSet<Order> Orders { get; set; }             
        public DbSet<OrderItem> OrderItems { get; set; }     
        public DbSet<Review> Reviews { get; set; }



        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure one-to-many relationships for Book
            builder.Entity<Book>()
                .HasOne(b => b.Publisher)
                .WithMany(p => p.Books)
                .HasForeignKey(b => b.PublisherId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Book>()
                .HasOne(b => b.Author)
                .WithMany(a => a.Books)
                .HasForeignKey(b => b.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Book>()
                .HasOne(b => b.Genre)
                .WithMany(g => g.Books)
                .HasForeignKey(b => b.GenreId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Cart relationships
            builder.Entity<Cart>()
                .HasOne(c => c.User)
                .WithMany(u => u.UserCart)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Cart>()
                .HasOne(c => c.Book)
                .WithMany(b => b.BookCarts)
                .HasForeignKey(c => c.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Bookmark relationships
            builder.Entity<Bookmark>()
                .HasOne(bm => bm.User)
                .WithMany(u => u.UserBookmarks)
                .HasForeignKey(bm => bm.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Bookmark>()
                .HasOne(bm => bm.Book)
                .WithMany(b => b.Bookmarks)
                .HasForeignKey(bm => bm.BookId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<BookAuthor>()
               .HasKey(ba => new { ba.BookId, ba.AuthorId });

            builder.Entity<BookGenre>()
                .HasKey(bg => new { bg.BookId, bg.GenreId });

            builder.Entity<Review>()
                .Property(r => r.Rating)
                .HasConversion<int>()
                .HasDefaultValue(1)
                .IsRequired();

            builder.Entity<OrderItem>()
        .HasOne(oi => oi.Order)
        .WithMany(o => o.Items)
        .HasForeignKey(oi => oi.OrderId)
        .OnDelete(DeleteBehavior.Cascade);

            // ——— Review ←→ User, Book ———
            builder.Entity<Review>(entity =>
            {
                entity.HasKey(r => r.ReviewId);

                entity
                  .HasOne(r => r.User)
                  .WithMany(u => u.UserReviews)
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

                entity
                  .HasOne(r => r.Book)
                  .WithMany(b => b.Reviews)
                  .HasForeignKey(r => r.BookId)
                  .OnDelete(DeleteBehavior.Cascade);

                entity.Property(r => r.Rating)
                      .IsRequired();
            });



            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}

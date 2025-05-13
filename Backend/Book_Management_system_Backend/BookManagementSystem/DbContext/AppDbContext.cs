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
        public DbSet<BookDiscount> BookDiscounts { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Publisher → Books
            builder.Entity<Book>()
                .HasOne(b => b.Publisher)
                .WithMany(p => p.Books)
                .HasForeignKey(b => b.PublisherId)
                .OnDelete(DeleteBehavior.Cascade);

            // Author → Books
            builder.Entity<Book>()
                .HasOne(b => b.Author)
                .WithMany(a => a.Books)
                .HasForeignKey(b => b.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Genre → Books
            builder.Entity<Book>()
                .HasOne(b => b.Genre)
                .WithMany(g => g.Books)
                .HasForeignKey(b => b.GenreId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cart relationships
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

            // Bookmark relationships
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

            // Many-to-many keys
            builder.Entity<BookAuthor>()
                .HasKey(ba => new { ba.BookId, ba.AuthorId });
            builder.Entity<BookGenre>()
                .HasKey(bg => new { bg.BookId, bg.GenreId });

            // Review configuration
            builder.Entity<Review>(entity =>
            {
                entity.HasKey(r => r.ReviewId);
                entity.Property(r => r.Rating)
                      .HasConversion<int>()
                      .IsRequired()
                      .HasDefaultValue(1);

                entity.HasOne(r => r.User)
                      .WithMany(u => u.UserReviews)
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(r => r.Book)
                      .WithMany(b => b.Reviews)
                      .HasForeignKey(r => r.BookId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // OrderItem → Order
            builder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // BookDiscount configuration
            builder.Entity<BookDiscount>(entity =>
            {
                entity.HasKey(d => d.BookDiscountId);

                entity.Property(d => d.DiscountPercentage)
                      .IsRequired();
                entity.Property(d => d.OnSale)
                      .HasDefaultValue(false);
                entity.Property(d => d.StartAt)
                      .IsRequired();
                entity.Property(d => d.EndAt)
                      .IsRequired();

                entity.HasOne(d => d.Book)
                      .WithMany(b => b.BookDiscounts)
                      .HasForeignKey(d => d.BookId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Announcement configuration
            builder.Entity<Announcement>(entity =>
            {
                entity.HasKey(a => a.AnnouncementId);

                entity.Property(a => a.Title)
                      .IsRequired();
                entity.Property(a => a.Message)
                      .IsRequired();
                entity.Property(a => a.StartAt)
                      .IsRequired();
                entity.Property(a => a.EndAt)
                      .IsRequired();
            });

            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}

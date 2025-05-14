using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BasicCrud.Model
{
  


    public class Publisher
    {
        public Guid PublisherId { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Description { get; set; }
        public string Website { get; set; }

        // Navigation property
        public ICollection<Book> Books { get; set; } = new List<Book>();
    }

    public class Author
    {
        public Guid AuthorId { get; set; } = Guid.NewGuid();
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Biography { get; set; }

        // Navigation property
        public ICollection<Book> Books { get; set; } = new List<Book>();
    }

    public class Genre
    {
        public Guid GenreId { get; set; } = Guid.NewGuid();
        [Required]
        public string Name { get; set; }

        // Navigation property
        public ICollection<Book> Books { get; set; } = new List<Book>();
    }

    public class Book
    {
        public Guid BookId { get; set; } = Guid.NewGuid();

        public string Title { get; set; }
        public string ISBN { get; set; }
        public string Description { get; set; }
        public DateTime? PublicationDate { get; set; }

        // Foreign keys
        public Guid? PublisherId { get; set; }
        public Publisher Publisher { get; set; }

        public Guid? AuthorId { get; set; }
        public Author Author { get; set; }

        public Guid? GenreId { get; set; }
        public Genre Genre { get; set; }

        public string Language { get; set; }
        public string Format { get; set; }
        public decimal Price { get; set; }
        public int StockCount { get; set; }
        public decimal AverageRating { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public string? BookImagePath { get; set; }

        // Navigation for user interactions
        public ICollection<Cart> BookCarts { get; set; } = new List<Cart>();
        public ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();
        public ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();
        public ICollection<BookGenre> BookGenres { get; set; } = new List<BookGenre>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<BookDiscount> BookDiscounts { get; set; } = new List<BookDiscount>();
    }

    public class Cart
    {
        public Guid CartId { get; set; } = Guid.NewGuid();

        // Identity user key is string
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public Guid BookId { get; set; }
        public Book Book { get; set; }

        public int Quantity { get; set; } = 1;
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }

    public class Bookmark
    {
        public Guid BookmarkId { get; set; } = Guid.NewGuid();

        // Identity user key is string
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public Guid BookId { get; set; }
        public Book Book { get; set; }

        public DateTime BookmarkedAt { get; set; } = DateTime.UtcNow;
    }
    public class BookAuthor
    {
        public int BookId { get; set; }
        public Book Book { get; set; }

        public int AuthorId { get; set; }
        public Author Author { get; set; }
    }
    public class BookGenre
    {
        public Guid BookId { get; set; }
        public Book Book { get; set; }
        public Guid GenreId { get; set; }
        public Genre Genre { get; set; }
    }
    public enum OrderStatus { Pending, Cancelled, Fulfilled }
    public class Order
    {
        public Guid OrderId { get; set; } = Guid.NewGuid();
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime OrderedAt { get; set; } = DateTime.UtcNow;
        public string ClaimCode { get; set; } = Guid.NewGuid().ToString("N");
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public decimal DiscountApplied { get; set; } = 0m;
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
      

    }

    public class OrderItem
    {
        public Guid OrderItemId { get; set; } = Guid.NewGuid();
        public Guid OrderId { get; set; }
        public Order Order { get; set; }
        public Guid BookId { get; set; }
        public Book Book { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
    }

    public class Review
    {
        public Guid ReviewId { get; set; } = Guid.NewGuid();
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public Guid BookId { get; set; }
        public Book Book { get; set; }
        [Range(1, 5)]
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    public class Announcement
    {
        public Guid AnnouncementId { get; set; } = Guid.NewGuid();
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
    public class BookDiscount
    {
        public Guid BookDiscountId { get; set; }
        public Guid BookId { get; set; }

        [JsonIgnore]              // <— don't walk back from discount to book
        public Book Book { get; set; }

        public decimal DiscountPercentage { get; set; }
        public bool OnSale { get; set; } = false;
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
    public class Notification
    {
        public Guid NotificationId{ get; set; } = Guid.NewGuid();
        public string UserId{ get; set; }

        // ← this must be here:
        public Guid? BookId { get; set; }
        public Book? Book { get; set; }

        public string Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
    }

}

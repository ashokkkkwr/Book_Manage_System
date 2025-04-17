using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace BasicCrud.Model
{
    // Identity user


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
        public int BookId { get; set; }
        public Book Book { get; set; }

        public int GenreId { get; set; }
        public Genre Genre { get; set; }
    }
}

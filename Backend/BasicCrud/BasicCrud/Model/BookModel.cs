namespace BasicCrud.Model
{
    public class Publisher
    {
        public Guid PublisherId { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Description { get; set; }
        public string Website { get; set; }

        // Navigation property
        public ICollection<Book> Books { get; set; }
    }

    public class Author
    {
        public int AuthorId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Biography { get; set; }

        // Navigation property
        public ICollection<BookAuthor> BookAuthors { get; set; }
    }

    public class Book
    {
        // Set the BookId property to automatically generate a new GUID upon creation.
        public Guid BookId { get; set; } = Guid.NewGuid();

        public string Title { get; set; }
        public string ISBN { get; set; }
        public string Description { get; set; }
        public DateTime? PublicationDate { get; set; }
        public Guid? PublisherId { get; set; }
        public string Language { get; set; }
        public string Format { get; set; }
        public decimal Price { get; set; }
        public int StockCount { get; set; }
        public decimal AverageRating { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public string BookImagePath { get; set; }


        // Navigation properties
        public Publisher Publisher { get; set; }
        public ICollection<BookAuthor> BookAuthors { get; set; }
        public ICollection<BookGenre> BookGenres { get; set; }
    }

    // Join table for Many-to-Many relationship between Books and Authors
    public class BookAuthor
    {
        public int BookId { get; set; }
        public Book Book { get; set; }

        public int AuthorId { get; set; }
        public Author Author { get; set; }
    }

    public class Genre
    {
        public int GenreId { get; set; }
        public string Name { get; set; }

        // Navigation property
        public ICollection<BookGenre> BookGenres { get; set; }
    }

    public class BookGenre
    {
        public int BookId { get; set; }
        public Book Book { get; set; }

        public int GenreId { get; set; }
        public Genre Genre { get; set; }
    }
}

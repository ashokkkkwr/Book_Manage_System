// BasicCrud/DTO/BookListItemDto.cs
namespace BasicCrud.DTO
{
    public class BookListItemDto
    {
        public Guid BookId { get; set; }
        public string Title { get; set; } = null!;
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }

        // flatten navigation properties
        public string Genre { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string Publisher { get; set; } = null!;
    }
}

// BasicCrud/DTO/BookDetailsDto.cs
namespace BasicCrud.DTO
{
    public class BookDetailsDto
    {
        public Guid BookId { get; set; }
        public string Title { get; set; } = null!;
        public string ISBN { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? PublicationDate { get; set; }    // nullable to match your model
        public string Language { get; set; } = null!;
        public string Format { get; set; } = null!;
        public decimal Price { get; set; }
        public int StockCount { get; set; }

        public string Genre { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string Publisher { get; set; } = null!;

        public string? ImageUrl { get; set; }
    }
}

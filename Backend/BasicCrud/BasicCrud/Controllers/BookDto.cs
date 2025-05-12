
namespace BasicCrud.Controllers
{
    internal class BookDto
    {
        public Guid BookId { get; set; }
        public string Title { get; set; }
        public string ISBN { get; set; }
        public string Description { get; set; }
        public DateTime? PublicationDate { get; set; }
        public string PublisherName { get; set; }
        public string GenreName { get; set; }
        public string Language { get; set; }
        public string AuthorFullName { get; set; }
        public string Format { get; set; }
        public decimal Price { get; set; }
        public int StockCount { get; set; }
        public string BookImagePath { get; set; }
    }
}
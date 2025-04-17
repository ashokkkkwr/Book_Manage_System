using Microsoft.AspNetCore.Http;
using System;

namespace BasicCrud.DTO
{
    public class CreateBookDto
    {
        public string Title { get; set; }
        public string ISBN { get; set; }
        public string Description { get; set; }
        public DateTime? PublicationDate { get; set; }
        public Guid? PublisherId { get; set; }

        public Guid? AuthorId { get; set; }

        public Guid? GenreId { get; set; }  // if your design uses Guid
        // if your design uses Guid
        public string Language { get; set; }
        public string Format { get; set; }
        public decimal Price { get; set; }
        public int StockCount { get; set; }

        // Added property for file upload
        public IFormFile BookImage { get; set; }
    }
}

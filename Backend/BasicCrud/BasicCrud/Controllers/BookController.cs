using System;
using System.IO;
using System.Threading.Tasks;
using BasicCrud.DbContext;
using BasicCrud.DTO;
using BasicCrud.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BasicCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class BookController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly string _imageFolderPath = "wwwroot/uploads"; // relative path for images

        public BookController(AppDbContext dbContext)
        {
            _dbContext = dbContext;

            // Ensure the folder exists.
            if (!Directory.Exists(_imageFolderPath))
            {
                Directory.CreateDirectory(_imageFolderPath);
            }
        }

        // POST: api/Book/addBook
        [HttpPost("addBook")]
        [Consumes("multipart/form-data")] // Inform Swagger the endpoint accepts multipart/form-data
        public async Task<IActionResult> AddBook([FromForm] CreateBookDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid book data.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string imagePath = null;

            // Save the file if provided
            if (dto.BookImage != null && dto.BookImage.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.BookImage.FileName)}";
                var savePath = Path.Combine(_imageFolderPath, fileName);

                using (var fileStream = new FileStream(savePath, FileMode.Create))
                {
                    await dto.BookImage.CopyToAsync(fileStream);
                }
                imagePath = $"/uploads/{fileName}";
            }

            // Map DTO to Book model
            var book = new Book
            {
                Title = dto.Title,
                ISBN = dto.ISBN,
                Description = dto.Description,
                PublicationDate = dto.PublicationDate,
                PublisherId = dto.PublisherId,
                Language = dto.Language,
                Format = dto.Format,
                Price = dto.Price,
                StockCount = dto.StockCount,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                BookImagePath = imagePath
            };

            await _dbContext.Books.AddAsync(book);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Book added successfully", bookId = book.BookId });
        }
    }
}

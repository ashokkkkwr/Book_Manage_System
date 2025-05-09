﻿using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BasicCrud.DbContext;
using BasicCrud.DTO;
using BasicCrud.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BasicCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class BookController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly string _imageFolderPath = "wwwroot/uploads";

        public BookController(AppDbContext dbContext)
        {
            _dbContext = dbContext;

            if (!Directory.Exists(_imageFolderPath))
            {
                Directory.CreateDirectory(_imageFolderPath);
            }
        }

        // POST: api/Book/addBook
        [HttpPost("addBook")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddBook([FromForm] CreateBookDto dto)
        {
            if (dto == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            string? imagePath = null;

            if (dto.BookImage is not null && dto.BookImage.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.BookImage.FileName)}";
                var savePath = Path.Combine(_imageFolderPath, fileName);

                using var fileStream = new FileStream(savePath, FileMode.Create);
                await dto.BookImage.CopyToAsync(fileStream);

                imagePath = $"/uploads/{fileName}";
            }

            var book = new Book
            {
                Title = dto.Title,
                ISBN = dto.ISBN,
                Description = dto.Description,
                PublicationDate = dto.PublicationDate,
                PublisherId = dto.PublisherId,
                GenreId = dto.GenreId,
                Language = dto.Language,
                AuthorId = dto.AuthorId,
                Format = dto.Format,
                Price = dto.Price,
                StockCount = dto.StockCount,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                BookImagePath = imagePath ?? string.Empty
            };

            await _dbContext.Books.AddAsync(book);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Book added successfully", bookId = book.BookId });
        }

        // GET: api/Book/catalogue
        [HttpGet("catalogue")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBooks(
            int page = 1,
            int pageSize = 10,
            string? search = null,
            Guid? genreId = null,
            string sort = "title_asc")
        {
            var query = _dbContext.Books
                .Include(b => b.Genre)
                .Include(b => b.Author)
                .Include(b => b.Publisher)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(b =>
                    EF.Functions.Like(b.Title, $"%{search}%") ||
                    EF.Functions.Like(b.Description, $"%{search}%"));

            if (genreId.HasValue)
                query = query.Where(b => b.GenreId == genreId.Value);

            query = sort.ToLower() switch
            {
                "title_desc" => query.OrderByDescending(b => b.Title),
                "price_asc" => query.OrderBy(b => b.Price),
                "price_desc" => query.OrderByDescending(b => b.Price),
                _ => query.OrderBy(b => b.Title),
            };

            var totalItems = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BookListItemDto
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    Price = b.Price,
                    ImageUrl = b.BookImagePath,
                    Genre = b.Genre.Name,  // assuming Genre has a Name property
                    Publisher = b.Publisher.Name,
                    Author = b.Author.FirstName + " " + b.Author.LastName
                })
                .ToListAsync();

            return Ok(new
            {
                page,
                pageSize,
                totalItems,
                totalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                books = items
            });
        }

        // GET: api/Book/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBookDetails(Guid id)
        {
            var dto = await _dbContext.Books
                .Where(b => b.BookId == id)
                .Select(b => new BookDetailsDto
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    ISBN = b.ISBN,
                    Description = b.Description,
                    PublicationDate = b.PublicationDate, 
                    Language = b.Language,
                    Format = b.Format,
                    Price = b.Price,
                    StockCount = b.StockCount,
                    Genre = b.Genre.Name,
                    Publisher = b.Publisher.Name,
                    Author = b.Author.FirstName + " " + b.Author.LastName,
                    ImageUrl = b.BookImagePath
                })
                .FirstOrDefaultAsync();

            if (dto is null)
                return NotFound(new { message = "Book not found" });

            return Ok(dto);
        }
        // DELETE: api/Book/deleteBook/{id}
        [HttpDelete("deleteBook/{id}")]
        public async Task<IActionResult> DeleteBook(Guid id)
        {
            var book = await _dbContext.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { message = "Book not found" });

            // Delete image file if exists
            if (!string.IsNullOrEmpty(book.BookImagePath))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", book.BookImagePath.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }

            _dbContext.Books.Remove(book);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Book deleted successfully" });
        }
        [HttpPatch("updateBook/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateBook(Guid id, [FromForm] CreateBookDto dto)
        {
            if (dto == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            var book = await _dbContext.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { message = "Book not found" });

            // Update fields
            book.Title = dto.Title;
            book.ISBN = dto.ISBN;
            book.Description = dto.Description;
            book.PublicationDate = dto.PublicationDate;
            book.PublisherId = dto.PublisherId;
            book.GenreId = dto.GenreId;
            book.Language = dto.Language;
            book.AuthorId = dto.AuthorId;
            book.Format = dto.Format;
            book.Price = dto.Price;
            book.StockCount = dto.StockCount;

            // Handle image replacement
            if (dto.BookImage != null && dto.BookImage.Length > 0)
            {
                // Delete old file if exists
                if (!string.IsNullOrEmpty(book.BookImagePath))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", book.BookImagePath.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.BookImage.FileName)}";
                var savePath = Path.Combine(_imageFolderPath, fileName);
                using var fileStream = new FileStream(savePath, FileMode.Create);
                await dto.BookImage.CopyToAsync(fileStream);
                book.BookImagePath = $"/uploads/{fileName}";
            }

            book.UpdatedAt = DateTime.UtcNow;
            _dbContext.Books.Update(book);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Book updated successfully" });
        }
    }

}

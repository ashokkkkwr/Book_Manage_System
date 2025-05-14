using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BasicCrud.DbContext;
using BasicCrud.DTO;
using BasicCrud.Model;
using BookManagementSystem.DTO;
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
        [AllowAnonymous]
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
                PublicationDate = dto.PublicationDate?.ToUniversalTime(),
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
            Guid? authorId = null,
            Guid? genreId = null,
            bool? inStock = null,
            // To enable library access filtering, add a bool PhysicalLibraryAccess property to your Book model and DTO
            bool? physicalLibraryAccess = null,
            decimal? priceMin = null,
            decimal? priceMax = null,
            decimal? ratingMin = null,
            decimal? ratingMax = null,
            string? language = null,
            string? format = null,
            string sort = "title_asc"
        )
        {
            var now = DateTime.UtcNow;
            var query = _dbContext.Books
                .Include(b => b.Publisher)
                .Include(b => b.BookAuthors).ThenInclude(ba => ba.Author)
                .Include(b => b.BookGenres).ThenInclude(bg => bg.Genre)
                .Include(b => b.BookDiscounts)
                .AsQueryable();

            // Full-text search
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(b =>
                    EF.Functions.Like(b.Title, $"%{search}%") ||
                    EF.Functions.Like(b.Description, $"%{search}%"));
            }

            // Filters
            if (authorId.HasValue)
                query = query.Where(b => b.AuthorId.HasValue && b.AuthorId.Value == authorId.Value);

            if (genreId.HasValue)
                query = query.Where(b => b.BookGenres.Any(bg => bg.GenreId == genreId.Value));

            if (inStock.HasValue)
                query = inStock.Value ? query.Where(b => b.StockCount > 0) : query.Where(b => b.StockCount == 0);

            // physicalLibraryAccess filter disabled until model is updated
            // if (physicalLibraryAccess.HasValue)
            //     query = query.Where(b => b.PhysicalLibraryAccess == physicalLibraryAccess.Value);

            if (priceMin.HasValue)
                query = query.Where(b => b.Price >= priceMin.Value);
            if (priceMax.HasValue)
                query = query.Where(b => b.Price <= priceMax.Value);

            if (ratingMin.HasValue)
                query = query.Where(b => b.AverageRating >= ratingMin.Value);
            if (ratingMax.HasValue)
                query = query.Where(b => b.AverageRating <= ratingMax.Value);

            if (!string.IsNullOrWhiteSpace(language))
                query = query.Where(b => b.Language == language);

            if (!string.IsNullOrWhiteSpace(format))
            {
                var formats = format.Split(',').Select(f => f.Trim()).ToList();
                query = query.Where(b => formats.Contains(b.Format));
            }

            // Sorting
            query = sort.ToLower() switch
            {
                "title_desc" => query.OrderByDescending(b => b.Title),
                "price_asc" => query.OrderBy(b => b.Price),
                "price_desc" => query.OrderByDescending(b => b.Price),
                "rating_desc" => query.OrderByDescending(b => b.AverageRating),
                "rating_asc" => query.OrderBy(b => b.AverageRating),
                _ => query.OrderBy(b => b.Title),
            };

            // Pagination
            var totalItems = await query.CountAsync();
            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new {
                    b.BookId,
                    b.Title,
                    OriginalPrice = b.Price,
                    DiscountedPrice = b.BookDiscounts
                        .Where(d => d.OnSale && d.StartAt <= now && d.EndAt >= now)
                        .OrderByDescending(d => d.StartAt)
                        .Select(d => (decimal?)(b.Price * (1 - d.DiscountPercentage / 100m)))
                        .FirstOrDefault() ?? b.Price,
                    b.StockCount,
                    b.AverageRating,
                    b.Language,
                    b.Format,
                    Authors = b.BookAuthors.Select(ba => new { ba.Author.FirstName, ba.Author.LastName }),
                    Genres = b.BookGenres.Select(bg => bg.Genre.Name)
                })
                .ToListAsync();

            return Ok(new {
                page,
                pageSize,
                totalItems,
                totalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                books
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
        [AllowAnonymous]
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
        [AllowAnonymous]
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

            if (dto.BookImage != null && dto.BookImage.Length > 0)
            {
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
        [HttpGet("getAllBooks")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllBooks()
        {
            var now = DateTime.UtcNow;

            var books = await _dbContext.Books
                .Include(b => b.Publisher)
                .Include(b => b.BookAuthors).ThenInclude(ba => ba.Author)
                .Include(b => b.BookGenres).ThenInclude(bg => bg.Genre)
                .Include(b => b.BookDiscounts)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new
                {
                    b.BookId,
                    b.Title,
                    b.ISBN,
                    b.Description,
                    b.PublicationDate,
                    b.Language,
                    b.Format,
                    Price = b.Price,
                    b.StockCount,
                    BookImagePath = b.BookImagePath,
                    b.CreatedAt,

                    Discount = b.BookDiscounts == null ? null : new
                    {
                        b.BookDiscounts,
                       
                    },
                    // Pull out the “current” discount (or null if none)
                    //CurrentDiscounts = b.BookDiscounts
                    //    .Where(d => d.OnSale && d.StartAt <= now && d.EndAt >= now)
                    //    .OrderByDescending(d => d.StartAt)
                    //    .Select(d => new
                    //    {
                    //        d.BookDiscountId,
                    //        d.DiscountPercentage,
                    //        d.OnSale,
                    //        d.StartAt,
                    //        d.EndAt
                    //    })
                    //    .FirstOrDefault(),

                    // Compute discounted price or fall back to original
                    DiscountedPrice = b.BookDiscounts
                        .Where(d => d.OnSale && d.StartAt <= now && d.EndAt >= now)
                        .OrderByDescending(d => d.StartAt)
                        .Select(d => (decimal?)(b.Price * (1 - d.DiscountPercentage / 100m)))
                        .FirstOrDefault(),

                    Publisher = b.Publisher == null ? null : new
                    {
                        b.Publisher.PublisherId,
                        b.Publisher.Name,
                        b.Publisher.Website,
                    },

                    Author = b.Author == null ? null : new
                    {
                        b.Author.AuthorId,
                        b.Author.FirstName,
                        b.Author.LastName,
                    },

                    Genre = b.Genre == null ? null : new
                    {
                        b.Genre.GenreId,
                        b.Genre.Name,
                    },

                })
                .ToListAsync();

            return Ok(books);
        }


        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchBooksByTitle([FromQuery] string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return BadRequest(new { message = "Search query cannot be empty." });

            var books = await _dbContext.Books
                .Where(b => EF.Functions.ILike(b.Title, $"%{title}%"))
                .Select(b => new
                {
                    b.BookId,
                    b.Title,
                    b.Description,
                    b.Price,
                    b.BookImagePath
                })
                .ToListAsync();

            return Ok(books);
        }
       
        [HttpPost("addDiscount")]
      
        [AllowAnonymous]
        public async Task<IActionResult> AddDiscount([FromForm] CreateDiscountDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var book = await _dbContext.Books.FindAsync(dto.BookId);
            if (book == null)
                return NotFound(new { message = "Book not found" });

            var discount = new BookDiscount
            {
                BookId = dto.BookId,
                DiscountPercentage = dto.DiscountPercentage,
                OnSale = dto.OnSale,
                StartAt = dto.StartAt.ToUniversalTime(),
                EndAt = dto.EndAt.ToUniversalTime()
            };
            //await _dbContext.Books.AddAsync(book);

            await _dbContext.BookDiscounts.AddAsync(discount);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDiscount), new { id = discount.BookDiscountId }, discount);
        }




        // GET: api/discounts/{id}
        [HttpGet("discount/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDiscount(Guid id)
        {
            var discount = await _dbContext.BookDiscounts.FindAsync(id);
            if (discount == null)
                return NotFound(new { message = "Discount not found" });
            return Ok(discount);
        }
        // GET: api/discounts/active?bookId={bookId}
        [HttpGet("discount/active")]
        [AllowAnonymous]
        public async Task<IActionResult> GetActiveDiscounts([FromQuery] Guid? bookId)
        {
            var now = DateTime.UtcNow;
            var query = _dbContext.BookDiscounts
                .Where(d => d.StartAt <= now && d.EndAt >= now);

            if (bookId.HasValue)
                query = query.Where(d => d.BookId == bookId.Value);

            var results = await query.ToListAsync();
            return Ok(results);
        }
        // DELETE: api/discounts/{id}
        [HttpDelete("discount/delete/{id}")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> DeleteDiscount(Guid id)
        {
            var discount = await _dbContext.BookDiscounts.FindAsync(id);
            if (discount == null)
                return NotFound(new { message = "Discount not found" });
            _dbContext.BookDiscounts.Remove(discount);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }
    }




}

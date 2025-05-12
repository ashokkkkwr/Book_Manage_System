using System.Security.Claims;
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
    [Authorize(Roles = "Member")]
    public class BookMarkController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public BookMarkController(AppDbContext dbContext)
        {
            _dbContext = dbContext;


        }
        [HttpPost("toggle")]
        public async Task<IActionResult> BookMark([FromBody] CreateBookmarkDTO dto)
        {
            Console.WriteLine(dto);
            if (dto == null)
            {
                return BadRequest("Invalid bookmark data.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token.");
            }
            var existing = await _dbContext.Bookmarks
       .FirstOrDefaultAsync(b => b.UserId == userId && b.BookId == dto.BookId);

            if (existing != null)
            {
                // already bookmarked → remove it
                _dbContext.Bookmarks.Remove(existing);
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Bookmark removed" });
            }
            else
            {
                var bookmark = new Bookmark
                {
                    UserId = userId,
                    BookId = dto.BookId,
                };

                await _dbContext.Bookmarks.AddAsync(bookmark);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Book bookmarked successfully" });
            }
      
        }

        [HttpGet("getBookmark")]
        public async Task<IActionResult> GetBookmarks()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token.");
            }

            var bookmarks = await _dbContext.Bookmarks
                .Where(b => b.UserId == userId)
                .Include(b => b.Book) // Includes book details
                .ToListAsync();

            var result = bookmarks.Select(b => new
            {
                b.BookmarkId,
                b.BookId,
                b.UserId,
                Book = new
                {
                    b.Book.BookId,
                    b.Book.Title,
                    b.Book.Price,
                    b.Book.Description,
                    b.Book.Author
                }
            });

            return Ok(result);
        }

    }
}


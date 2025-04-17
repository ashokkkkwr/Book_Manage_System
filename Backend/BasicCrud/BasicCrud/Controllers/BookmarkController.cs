using BasicCrud.DbContext;
using BasicCrud.DTO;
using BasicCrud.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        [HttpPost("create")]
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


            var bookmark = new Bookmark
            {
                UserId = dto.UserId,
                BookId = dto.BookId,
            };

            await _dbContext.Bookmarks.AddAsync(bookmark);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Book bookmarked successfully" });
        }
    }
}


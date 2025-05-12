using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BasicCrud.DbContext;
using BasicCrud.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BasicCrud.Controllers
{
    [Route("api/books/{bookId:guid}/reviews")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ReviewsController(AppDbContext db)
        {
            _db = db;
        }

        // MEMBER: post a review for a purchased book
        [HttpPost]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> CreateReview(Guid bookId, [FromBody] ReviewDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized("User ID is missing.");

            // 1) Verify the book exists
            var bookExists = await _db.Books.AnyAsync(b => b.BookId == bookId);
            if (!bookExists)
                return NotFound("Book not found.");

            // 2) Check that the member has at least one fulfilled order with this book
            var hasPurchased = await _db.Orders
                .Where(o => o.UserId == userId && o.Status == OrderStatus.Fulfilled)
                .SelectMany(o => o.Items)
                .AnyAsync(i => i.BookId == bookId);

            if (!hasPurchased)
                return BadRequest("You can only review books you have purchased.");

            // 3) (Optional) Prevent duplicate reviews per book per user
            var alreadyReviewed = await _db.Reviews
                .AnyAsync(r => r.BookId == bookId && r.UserId == userId);
            if (alreadyReviewed)
                return BadRequest("You have already reviewed this book.");

            // 4) Create and save the review
            var review = new Review
            {
                ReviewId = Guid.NewGuid(),
                UserId = userId,
                BookId = bookId,
                Rating = dto.Rating,
                Comment = dto.Comment
            };
            _db.Reviews.Add(review);
            await _db.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetReviewsForBook),
                new { bookId },
                new { review.ReviewId, review.Rating, review.Comment, review.CreatedAt }
            );
        }

        // GET all reviews for a book
        [HttpGet]
        public async Task<IActionResult> GetReviewsForBook(Guid bookId)
        {
            var reviews = await _db.Reviews
                .Where(r => r.BookId == bookId)
                .Select(r => new
                {
                    r.ReviewId,
                    r.UserId,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt,
                    r.User.FullName,
                })
                .ToListAsync();

            return Ok(reviews);
        }
    }

        // DTO for incoming review data
        public class ReviewDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}

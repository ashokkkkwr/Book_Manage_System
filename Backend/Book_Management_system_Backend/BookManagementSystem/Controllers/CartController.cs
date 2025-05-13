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
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public CartController(AppDbContext dbContext)
        {
            _dbContext = dbContext;


        }
        [HttpPost("create")]
        public async Task<IActionResult> AddToCart([FromBody] CreateCartDTO dto)
        {
            Console.WriteLine(dto);
            if (dto == null)
            {
                return BadRequest("Invalid cart data.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);



            Console.WriteLine(dto);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token.");
            }
            var cart = new Cart
            {
                UserId = userId,
                BookId = dto.BookId,
                Quantity = dto.Quantity,
            };

            await _dbContext.Carts.AddAsync(cart);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Book added to cart successfully" });
        }

        [HttpGet("getCarts")]
        public async Task<IActionResult> GetCarts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token.");
            }

            var carts = await _dbContext.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Book)
                .Select(c => new
                {
                    c.CartId,
                    c.Quantity,
                    Book = new
                    {
                        c.Book.BookId,
                        c.Book.Title,
                        c.Book.Author,
                        c.Book.Price
                    }
                })
                .ToListAsync();

            return Ok(carts);
        }



    }
}


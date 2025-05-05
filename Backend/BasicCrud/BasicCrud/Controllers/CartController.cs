using System.Security.Claims;
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
    }
}


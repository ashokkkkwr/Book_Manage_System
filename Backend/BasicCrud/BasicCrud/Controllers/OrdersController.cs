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
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IEmailService _emailService;


        public OrdersController(AppDbContext dbContext,
                         IEmailService emailService)
        {
            _dbContext = dbContext;
            _emailService = emailService;

        }

        // MEMBER: place an order for everything in cart
        [HttpPost("create")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> PlaceOrder()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID missing.");

            // load cart items including Book details
            var cartItems = await _dbContext.Carts
                .Include(c => c.Book)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
                return BadRequest("Your cart is empty.");

            // calculate totals
            var totalQty = cartItems.Sum(c => c.Quantity);
            var baseAmount = cartItems.Sum(c => c.Book.Price * c.Quantity);
            decimal discount = 0m;

            // 5% bulk
            if (totalQty >= 5)
                discount += 0.05m * baseAmount;

            // stackable 10% every 10 orders
            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null) return Unauthorized();
            if (user.NextOrderDiscount > 0)
            {
                discount += user.NextOrderDiscount * baseAmount;
                user.NextOrderDiscount = 0;
            }
            // build Order
            var order = new Order
            {
                UserId = userId,
                DiscountApplied = discount,
                Status = OrderStatus.Pending
            };
            foreach (var c in cartItems)
            {
                order.Items.Add(new OrderItem
                {
                    BookId = c.BookId,
                    Quantity = c.Quantity,
                    UnitPrice = c.Book.Price
                });

                // adjust stock
                c.Book.StockCount -= c.Quantity;
            }
            // increment successful orders count & apply next-order discount
            user.SuccessfulOrdersCount++;
            if (user.SuccessfulOrdersCount % 10 == 0)
                user.NextOrderDiscount += 0.10m;

            // persist
            _dbContext.Orders.Add(order);
            _dbContext.Carts.RemoveRange(cartItems);
            await _dbContext.SaveChangesAsync();
            var userEmail = user.Email;
            try
            {
                await _emailService.SendOrderReceiptAsync(userEmail, order);
            }
            catch (Exception ex)
            {
                // LOG the exception internally
                //_logger.LogError(ex, "Failed to send order receipt email.");

                // Return just the message (or a ProblemDetails):
                return StatusCode(500, new
                {
                    Error = "There was a problem sending your receipt email.",
                    Details = ex.Message    // or omit in production
                });
            }
            return Ok(new
            {
                Message = "Order placed and receipt emailed",
                order.OrderId,
                order.ClaimCode,
                Total = baseAmount - discount
            });

            
        }

        // MEMBER: list my orders
        [HttpGet("my")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID missing.");

            var orders = await _dbContext.Orders
                .Where(o => o.UserId == userId)
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderedAt,
                    o.Status,
                    o.ClaimCode,
                    o.DiscountApplied,
                    Items = o.Items.Select(i => new {
                        i.Book.Title,
                        i.Quantity,
                        i.UnitPrice
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        // MEMBER: cancel a pending order
        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> CancelOrder(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID missing.");

            var order = await _dbContext.Orders.FindAsync(id);
            if (order == null)
                return NotFound("Order not found.");

            if (order.UserId != userId)
                return Forbid();

            if (order.Status != OrderStatus.Pending)
                return BadRequest("Only pending orders can be cancelled.");

            order.Status = OrderStatus.Cancelled;
            await _dbContext.SaveChangesAsync();
            return Ok(new { Message = "Order cancelled." });
        }

        // STAFF/ADMIN: process (fulfil) by claim code
        [HttpPost("process/{claimCode}")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<IActionResult> ProcessOrder(string claimCode)
        {
            var order = await _dbContext.Orders
                .FirstOrDefaultAsync(o => o.ClaimCode == claimCode);

            if (order == null)
                return NotFound("Invalid claim code.");

            if (order.Status != OrderStatus.Pending)
                return BadRequest("Order cannot be processed.");

            order.Status = OrderStatus.Fulfilled;
            await _dbContext.SaveChangesAsync();
            return Ok(new { Message = "Order fulfilled.", order.OrderId });
        }
    }
}

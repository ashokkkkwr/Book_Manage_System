// BasicCrud.Controllers/NotificationsController.cs
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
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public NotificationsController(AppDbContext db) => _db = db;

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var notes = await _db.Notifications
                                .Where(n => n.UserId == userId)
                                .OrderByDescending(n => n.CreatedAt)
                                .ToListAsync();
            return Ok(notes);
        }

        [HttpPut("{id}/read")]
        [Authorize]
        public async Task<IActionResult> MarkRead(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var n = await _db.Notifications.FindAsync(id);
            if (n == null || n.UserId != userId) return NotFound();
            n.IsRead = true;
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

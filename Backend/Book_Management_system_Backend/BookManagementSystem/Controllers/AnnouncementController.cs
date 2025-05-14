using System.Security.Claims;
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
    public class AnnouncementController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public AnnouncementController(AppDbContext dbContext)
        {
            _dbContext = dbContext;


        }
        [HttpPost("createAnnouncement")]
        [Authorize(Roles = "Staff")]

        public async Task<IActionResult> CreateAnnouncement([FromBody] CreateAnnouncementDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var announcement = new Announcement
            {
                Title = dto.Title,
                Message = dto.Message,
                StartAt = dto.StartAt.ToUniversalTime(),
                EndAt = dto.EndAt.ToUniversalTime()
            };

            await _dbContext.Announcements.AddAsync(announcement);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAnnouncement), new { id = announcement.AnnouncementId }, announcement);
        }

        [HttpGet("getAnnouncement")]
        public async Task<IActionResult> GetAnnouncement(Guid id)
        {
            var announcement = await _dbContext.Announcements.FindAsync(id);
            if (announcement == null)
                return NotFound(new { message = "Announcement not found" });
            return Ok(announcement);
        }

        [HttpGet("getAnnouncements")]
        public async Task<IActionResult> GetAnnouncement()
        {
            var announcements = await _dbContext.Announcements.ToListAsync();
            return Ok(announcements);
        }


        [HttpGet("active")]
        public async Task<IActionResult> GetActiveAnnouncements()
        {
            var now = DateTime.UtcNow;
            var list = await _dbContext.Announcements
                .Where(a => a.StartAt <= now && a.EndAt >= now)
                .ToListAsync();

            return Ok(list);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(Guid id)
        {
            var announcement = await _dbContext.Announcements.FindAsync(id);
            if (announcement == null)
                return NotFound(new { message = "Announcement not found" });

            _dbContext.Announcements.Remove(announcement);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }





    }
}


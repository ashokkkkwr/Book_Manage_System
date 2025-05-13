using System.Security.Claims;
using BasicCrud.DbContext;
using BasicCrud.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BasicCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Member")]
    public class abcController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public abcController(AppDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [HttpGet("getuser")]

        public async Task<IActionResult> GetUser()
        {
            Console.WriteLine("Hahahahaha");
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found in token.");
            Console.WriteLine("Hahahahaha");

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound("User not found.");

            var roles = await _userManager.GetRolesAsync(user);
            Console.WriteLine(roles);
            Console.WriteLine("Hahahahaha");
            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.FullName,
                Roles = roles
            });
        }
    }
}

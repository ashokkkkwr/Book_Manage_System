using System.Security.Claims;
using BasicCrud.DbContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BasicCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles ="Member")]
    public class abcController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public abcController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("getuser")]

        public async Task <IActionResult> GetUsers()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            

            return Ok( userId);
        }

    }
}

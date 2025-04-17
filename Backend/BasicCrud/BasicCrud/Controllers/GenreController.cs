using BasicCrud.DbContext;
using BasicCrud.DTO;
using BasicCrud.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BasicCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class GenreController: ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public GenreController(AppDbContext dbContext)
        {
            _dbContext = dbContext;

        
        }
        [HttpPost("create")]
        public async Task<IActionResult> AddGenre([FromBody] CreateGenreDTO dto)
        {
            Console.WriteLine(dto);
            if (dto == null)
            {
                return BadRequest("Invalid genre data.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


           var genre = new Genre
            {
                Name = dto.Name
            };

            await _dbContext.Genres.AddAsync(genre);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Genre added successfully" });
        }
    }
}


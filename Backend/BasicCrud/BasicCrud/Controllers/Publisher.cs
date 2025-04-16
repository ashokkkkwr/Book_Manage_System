using System.Threading.Tasks;
using BasicCrud.DbContext;
using BasicCrud.DTO;
using BasicCrud.Model;
using Microsoft.AspNetCore.Mvc;

namespace BasicCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublisherController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public PublisherController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // POST: api/Publisher/create
        [HttpPost("create")]
        public async Task<IActionResult> CreatePublisher([FromBody] CreatePublisherDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid publisher data.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Map the DTO to the Publisher entity.
            var publisher = new Publisher
            {
                Name = dto.Name,
                Description = dto.Description,
                Website = dto.Website
            };

            // Save the publisher to the database.
            await _dbContext.Publishers.AddAsync(publisher);
            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                message = "Publisher created successfully",
                publisherId = publisher.PublisherId
            });
        }
    }
}

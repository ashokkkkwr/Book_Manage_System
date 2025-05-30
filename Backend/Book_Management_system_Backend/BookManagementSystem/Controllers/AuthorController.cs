﻿using BasicCrud.DbContext;
using BasicCrud.DTO;
using BasicCrud.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BasicCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class AuthorController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public AuthorController(AppDbContext dbContext)
        {
            _dbContext = dbContext;


        }
        [HttpPost("create")]
        [AllowAnonymous]
        public async Task<IActionResult> AddAuthor([FromBody] CreateAuthorDTO dto)
        {
            Console.WriteLine(dto);
            if (dto == null)
            {
                return BadRequest("Invalid Author data.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var author = new Author
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Biography = dto.Biography
            };

            await _dbContext.Authors.AddAsync(author);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Author added successfully" });
        }

        [HttpGet("getAllAuthors")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllAuthors()
        {
            var authors = await _dbContext.Authors
                .Select(a => new
                {
                    a.AuthorId,
                    a.FirstName,
                    a.LastName,
                    a.Biography
                })
                .ToListAsync();

            return Ok(authors);
        }
    }
}


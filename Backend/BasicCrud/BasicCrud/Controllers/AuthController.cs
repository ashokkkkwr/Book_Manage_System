using BasicCrud.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;


namespace BasicCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
            _roleManager = roleManager;
        }
        // POST: api/Auth/Register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userExists = await _userManager.FindByNameAsync(model.UserName);
            if (userExists != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "User already exists!" });
            }

            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "User creation failed!", errors = result.Errors });
            }

            // Automatically assign the PublicUser role. This role is already seeded in your RoleConfiguration.
            var addRoleResult = await _userManager.AddToRoleAsync(user, "Member");
            if (!addRoleResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to assign the PublicUser role!", errors = addRoleResult.Errors });
            }
            return Ok(new { message = "User created successfully and PublicUser role assigned!" });
        }
        [HttpPost("registerStaff")]
        public async Task<IActionResult> RegisterStaff([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if user already exists.
            var userExists = await _userManager.FindByNameAsync(model.UserName);
            if (userExists != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "User already exists!" });
            }

            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "User creation failed!", errors = result.Errors });
            }

            // Automatically assign the Staff role.
            var addRoleResult = await _userManager.AddToRoleAsync(user, "Staff");
            if (!addRoleResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Failed to assign the Staff role!", errors = addRoleResult.Errors });
            }
            return Ok(new { message = "User created successfully and Staff role assigned!" });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the user by username.
            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user == null)
            {
                return Unauthorized(new { message = "Username not found." });
            }

            // Verify the password.
            if (!await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }

            // Get the user's roles.
            var userRoles = await _userManager.GetRolesAsync(user);

            // Set up claims and include the user's Id.
            var authClaims = new List<Claim>
{
    new Claim(ClaimTypes.Name, user.UserName),
    new Claim(ClaimTypes.NameIdentifier, user.Id), // This line adds the user ID.
        new Claim(ClaimTypes.Role,             "Member"),   // must match RoleClaimType

    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
};

            // Add role claims.
            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            // Get JWT settings from configuration.
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]));

            // Create the JWT token.
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                expires: DateTime.UtcNow.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            });
        }
        [HttpPost("loginStaff")]
        public async Task<IActionResult> LoginStaff([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the user by username.
            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user == null)
            {
                return Unauthorized(new { message = "Username not found." });
            }

            // Verify the password.
            if (!await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }

            // Get the user's roles.
            var userRoles = await _userManager.GetRolesAsync(user);

            // Ensure the user is in the Staff role.
            if (!userRoles.Contains("Staff"))
            {
                return Unauthorized(new { message = "User is not a staff member." });
            }

            // Set up claims.
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(ClaimTypes.Role,             "Staff"),   // must match RoleClaimType

                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Add role claims.
            foreach (var userRole in userRoles)
            {
    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            // Get JWT settings from configuration.
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]));

            // Create the JWT token.
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                expires: DateTime.UtcNow.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            });
        }



    }
}

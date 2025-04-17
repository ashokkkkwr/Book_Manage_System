using Microsoft.AspNetCore.Identity;

namespace BasicCrud.Model
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
        public ICollection<Cart> UserCart { get; set; } = new List<Cart>();
        public ICollection<Bookmark> UserBookmarks { get; set; } = new List<Bookmark>();

    }
}

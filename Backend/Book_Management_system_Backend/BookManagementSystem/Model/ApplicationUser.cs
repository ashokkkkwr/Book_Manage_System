using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace BasicCrud.Model
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
        [Column(TypeName = "decimal(5,4)")]   // optional: controls precision in SQL
        public decimal NextOrderDiscount { get; set; } = 0m;
        public ICollection<Cart> UserCart { get; set; } = new List<Cart>();
        public ICollection<Bookmark> UserBookmarks { get; set; } = new List<Bookmark>();
        public int SuccessfulOrdersCount { get; set; } = 0;
        public ICollection<Review> UserReviews { get; set; } = new List<Review>();

    }
}

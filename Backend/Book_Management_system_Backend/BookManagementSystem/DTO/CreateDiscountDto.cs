using System.ComponentModel.DataAnnotations;

namespace BookManagementSystem.DTO
{
    public class CreateDiscountDto
    {
        [Required]
        public Guid BookId { get; set; }
        [Range(0, 100)]
        public decimal DiscountPercentage { get; set; }
        public bool OnSale { get; set; } = false;
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace BookManagementSystem.DTO
{


    public class CreateAnnouncementDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Message { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
}
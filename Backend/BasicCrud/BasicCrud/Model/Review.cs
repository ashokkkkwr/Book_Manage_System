namespace BasicCrud.Model
{
    public class Review
    {
        public int ReviewId { get; set; }
        public string UserId { get; set; } // Reference to AspNetUsers.Id
        public int BookId { get; set; }
        public int Rating { get; set; }
        public string Comments { get; set; }
        public DateTime ReviewDate { get; set; } = DateTime.Now;

        // Navigation properties
        public Book Book { get; set; }
    }
}

namespace BasicCrud.DTO
{
    public class CreateBookmarkDTO
    {
        public string UserId { get; set; }

        public Guid BookId
        {
            get; set;
        }
    }
}

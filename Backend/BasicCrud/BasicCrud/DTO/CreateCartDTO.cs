namespace BasicCrud.DTO
{
    public class CreateCartDTO
    {
        public string UserId { get; set; }

        public Guid BookId
        {
            get; set;
        }

        public int Quantity { get; set; }
    }
}

namespace BasicCrud.DTO
{
    public class CreateCartDTO
    {
     

        public Guid BookId
        {
            get; set;
        }

        public int Quantity { get; set; }
    }
}

namespace BasicCrud.Model
{
    public class Order
    {
        public int OrderId { get; set; }
        public string UserId { get; set; } // Reference to AspNetUsers.Id
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public string OrderStatus { get; set; }
        public string ClaimCode { get; set; }
        public decimal Total { get; set; }
        public decimal DiscountApplied { get; set; }

        // Navigation properties
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }

    public class OrderDetail
    {
        public int OrderDetailId { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }

        public int BookId { get; set; }
        public Book Book { get; set; }

        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }

        // Optional: You can have a computed property for SubTotal
        public decimal SubTotal => (Quantity * Price) - Discount;
    }
}

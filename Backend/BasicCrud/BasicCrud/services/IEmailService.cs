using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;
using System.Text;
using BasicCrud.Configuration;
using BasicCrud.Model;
using MailKit.Security;


public interface IEmailService
{
    Task SendOrderReceiptAsync(string toEmail, Order order);
}

public class EmailService : IEmailService
{
    private readonly SmtpSettings _smtp;

    public EmailService(IOptions<SmtpSettings> smtpOptions)
    {
        _smtp = smtpOptions.Value;
    }

    public async Task SendOrderReceiptAsync(string toEmail, Order order)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_smtp.FromName, _smtp.FromEmail));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = $"Your Order Receipt – Claim Code {order.ClaimCode}";

        // Build an HTML receipt
        var bodyBuilder = new BodyBuilder();
        var sb = new StringBuilder();
        sb.AppendLine($"<h2>Thank you for your order!</h2>");
        sb.AppendLine($"<p><strong>Order ID:</strong> {order.OrderId}</p>");
        sb.AppendLine($"<p><strong>Claim Code:</strong> {order.ClaimCode}</p>");
        sb.AppendLine("<table style='width:100%; border-collapse: collapse;'>");
        sb.AppendLine("<thead><tr><th style='border:1px solid #ddd; padding:8px;'>Title</th>"
                    + "<th style='border:1px solid #ddd; padding:8px;'>Qty</th>"
                    + "<th style='border:1px solid #ddd; padding:8px;'>Unit Price</th>"
                    + "<th style='border:1px solid #ddd; padding:8px;'>Total</th></tr></thead>");
        sb.AppendLine("<tbody>");
        foreach (var item in order.Items)
        {
            var lineTotal = item.Quantity * item.UnitPrice;
            sb.AppendLine("<tr>"
                + $"<td style='border:1px solid #ddd; padding:8px;'>{item.Book.Title}</td>"
                + $"<td style='border:1px solid #ddd; padding:8px;text-align:center;'>{item.Quantity}</td>"
                + $"<td style='border:1px solid #ddd; padding:8px;text-align:right;'>${item.UnitPrice:F2}</td>"
                + $"<td style='border:1px solid #ddd; padding:8px;text-align:right;'>${lineTotal:F2}</td>"
                + "</tr>");
        }
        sb.AppendLine("</tbody></table>");

        decimal subTotal = order.Items.Sum(i => i.Quantity * i.UnitPrice);
        sb.AppendLine($"<p><strong>Subtotal:</strong> ${subTotal:F2}</p>");
        sb.AppendLine($"<p><strong>Discount Applied:</strong> ${order.DiscountApplied:F2}</p>");
        sb.AppendLine($"<p><strong>Total Paid:</strong> ${subTotal - order.DiscountApplied:F2}</p>");
        sb.AppendLine("<p>If you have any questions, simply reply to this email.</p>");

        bodyBuilder.HtmlBody = sb.ToString();
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(
    _smtp.Host,
    _smtp.Port,
    SecureSocketOptions.StartTls
);
        await client.AuthenticateAsync(_smtp.Username, _smtp.Password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}

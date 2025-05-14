using Microsoft.AspNetCore.SignalR;

namespace BookManagementSystem.Hubs
{
    public class OrderHub : Hub
    {
        public async Task SendNotification(string message)
        {
            await Clients.All.SendAsync("ReceiveNotification", message);
        }
    }
}
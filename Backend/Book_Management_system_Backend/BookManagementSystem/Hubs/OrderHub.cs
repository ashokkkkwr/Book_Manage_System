using System.Security.Claims;                          // for ClaimTypes
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;                    // for Hub, Groups, Context
using Microsoft.AspNetCore.Identity;                   // for UserManager<T>
using BasicCrud.Model;                       // for ApplicationUser (wherever you declared it)

namespace BasicCrud.Hubs
{
    public class OrderHub : Hub
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public OrderHub(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public override async Task OnConnectedAsync()
        {
            // extract the user’s ID from the claims principal
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null && await _userManager.IsInRoleAsync(user, "Member"))
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Members");
                }
            }

            await base.OnConnectedAsync();
        }
    }
}

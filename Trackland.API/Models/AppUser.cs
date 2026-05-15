using Microsoft.AspNetCore.Identity;

namespace Trackland.API.Models
{
    public class AppUser : IdentityUser
    {
        public ICollection<UserPreference> Preferences { get; set; } = new List<UserPreference>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public ICollection<ReadHistory> ReadHistory { get; set; } = new List<ReadHistory>();
    }
}
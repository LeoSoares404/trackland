namespace Trackland.API.Models
{
    public class UserPreference
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public AppUser User { get; set; } = null!;
    }
}
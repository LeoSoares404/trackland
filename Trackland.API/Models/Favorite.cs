namespace Trackland.API.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public string ArticleId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
        public string UserId { get; set; } = string.Empty;
        public AppUser User { get; set; } = null!;
    }
}
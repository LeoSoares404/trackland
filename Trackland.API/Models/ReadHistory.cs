namespace Trackland.API.Models
{
    public class ReadHistory
    {
        public int Id { get; set; }
        public string ArticleId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public DateTime ReadAt { get; set; } = DateTime.UtcNow;
        public string UserId { get; set; } = string.Empty;
        public AppUser User { get; set; } = null!;
    }
}
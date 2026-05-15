using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using Trackland.API.Data;

namespace Trackland.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NewsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;

        public NewsController(IConfiguration configuration, AppDbContext context, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("feed")]
        public async Task<IActionResult> GetFeed([FromQuery] int page = 1)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var categories = await _context.UserPreferences
                .Where(p => p.UserId == userId)
                .Select(p => p.Category)
                .ToListAsync();

            var query = categories.Any() ? string.Join(" OR ", categories) : "world";

            return await FetchFromGuardian(query, page);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] string? category, [FromQuery] int page = 1)
        {
            var searchQuery = q;
            if (!string.IsNullOrEmpty(category))
                searchQuery += $" AND {category}";

            return await FetchFromGuardian(searchQuery, page);
        }

        private async Task<IActionResult> FetchFromGuardian(string query, int page)
        {
            var apiKey = _configuration["Guardian:ApiKey"];
            var url = $"https://content.guardianapis.com/search?q={Uri.EscapeDataString(query)}&api-key={apiKey}&show-fields=trailText,byline,thumbnail&page-size=12&page={page}";

            try
            {
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    return StatusCode(503, new { message = "Serviço de notícias temporariamente indisponível." });

                var json = await response.Content.ReadAsStringAsync();
                var data = JsonDocument.Parse(json);

                var results = data.RootElement
                    .GetProperty("response")
                    .GetProperty("results");

                var totalPages = data.RootElement
                    .GetProperty("response")
                    .GetProperty("pages")
                    .GetInt32();

                var articles = new List<object>();
                foreach (var item in results.EnumerateArray())
                {
                    var fields = item.TryGetProperty("fields", out var f) ? f : (JsonElement?)null;
                    articles.Add(new
                    {
                        id = item.GetProperty("id").GetString(),
                        title = item.GetProperty("webTitle").GetString(),
                        url = item.GetProperty("webUrl").GetString(),
                        publishedAt = item.GetProperty("webPublicationDate").GetString(),
                        section = item.GetProperty("sectionName").GetString(),
                        description = fields?.TryGetProperty("trailText", out var trail) == true ? trail.GetString() : null,
                        source = "The Guardian"
                    });
                }

                return Ok(new { articles, totalPages, currentPage = page });
            }
            catch
            {
                return StatusCode(503, new { message = "Erro ao buscar notícias. Tente novamente." });
            }
        }
    }
}
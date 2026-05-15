using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Trackland.API.Data;
using Trackland.API.Models;

namespace Trackland.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoritesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var favorites = await _context.Favorites
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.SavedAt)
                .ToListAsync();
            return Ok(favorites);
        }

        [HttpPost]
        public async Task<IActionResult> AddFavorite([FromBody] FavoriteDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var exists = await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.ArticleId == dto.ArticleId);

            if (exists)
                return BadRequest(new { message = "Notícia já está nos favoritos." });

            var favorite = new Favorite
            {
                ArticleId = dto.ArticleId,
                Title = dto.Title,
                Url = dto.Url,
                Source = dto.Source,
                UserId = userId
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Adicionado aos favoritos!" });
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveFavorite([FromQuery] string articleId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ArticleId == articleId);

            if (favorite == null)
                return NotFound(new { message = "Favorito não encontrado." });

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Removido dos favoritos!" });
        }
    }

    public record FavoriteDto(string ArticleId, string Title, string Url, string Source);
}
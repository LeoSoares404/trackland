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
    public class HistoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HistoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var history = await _context.ReadHistories
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.ReadAt)
                .Take(50)
                .ToListAsync();
            return Ok(history);
        }

        [HttpPost]
        public async Task<IActionResult> AddToHistory([FromBody] HistoryDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var existing = await _context.ReadHistories
                .FirstOrDefaultAsync(h => h.UserId == userId && h.ArticleId == dto.ArticleId);

            if (existing != null)
            {
                existing.ReadAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Histórico atualizado!" });
            }

            var history = new ReadHistory
            {
                ArticleId = dto.ArticleId,
                Title = dto.Title,
                Url = dto.Url,
                UserId = userId
            };

            _context.ReadHistories.Add(history);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Adicionado ao histórico!" });
        }
    }

    public record HistoryDto(string ArticleId, string Title, string Url);
}
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
    public class PreferencesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PreferencesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPreferences()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var prefs = await _context.UserPreferences
                .Where(p => p.UserId == userId)
                .Select(p => p.Category)
                .ToListAsync();
            return Ok(prefs);
        }

        [HttpPost]
        public async Task<IActionResult> SavePreferences([FromBody] List<string> categories)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var existing = _context.UserPreferences.Where(p => p.UserId == userId);
            _context.UserPreferences.RemoveRange(existing);

            var newPrefs = categories.Select(c => new UserPreference
            {
                Category = c,
                UserId = userId
            });

            await _context.UserPreferences.AddRangeAsync(newPrefs);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Preferências salvas!" });
        }
    }
}
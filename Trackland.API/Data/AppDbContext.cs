using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Trackland.API.Models;

namespace Trackland.API.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserPreference> UserPreferences { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<ReadHistory> ReadHistories { get; set; }
    }
}
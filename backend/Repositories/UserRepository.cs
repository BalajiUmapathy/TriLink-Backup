using Backend.Data;
using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly TriLinkDbContext _context;

        public UserRepository(TriLinkDbContext context)
        {
            _context = context;
        }

        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                return null;
            }

            // In production, use BCrypt or similar for hashing. For this prototype, I'll assume simple match or implement simple hash.
            // WARNING: Storing plain text or simple hash is not secure. Use a library.
            // Check password
            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }

            return user;
        }

        public async Task<User?> RegisterAsync(User user, string password)
        {
            // Hash password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
             return await _context.Users.FindAsync(id);
        }

        public async Task<User?> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}

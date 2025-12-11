using Backend.Models.Domain;

namespace Backend.Repositories
{
    public interface IUserRepository
    {
        Task<User?> AuthenticateAsync(string username, string password);
        Task<User?> RegisterAsync(User user, string password); // Password for hashing
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> UpdateAsync(User user);
    }
}

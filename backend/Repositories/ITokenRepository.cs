using Backend.Models.Domain;

namespace Backend.Repositories
{
    public interface ITokenRepository
    {
        string CreateJWTToken(User user);
    }
}

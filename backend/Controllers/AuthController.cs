using AutoMapper;
using Backend.Models.Domain;
using Backend.Models.DTO;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenRepository _tokenRepository;
        private readonly IMapper _mapper;

        public AuthController(IUserRepository userRepository, ITokenRepository tokenRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _tokenRepository = tokenRepository;
            _mapper = mapper;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromForm] RegisterRequestDto registerRequestDto)
        {
            // Handle File Uploads
            if (registerRequestDto.GSTCertificateFile != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(registerRequestDto.GSTCertificateFile.FileName);
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                
                if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await registerRequestDto.GSTCertificateFile.CopyToAsync(stream);
                }

                // Set the URL (Assuming local hosting, you might want to return a full URL or relative path)
                // For now, storing relative path accessible via static files
                var request = HttpContext.Request;
                var domain = $"{request.Scheme}://{request.Host}";
                registerRequestDto.GSTCertificateUrl = $"{domain}/uploads/{fileName}";
            }

            if (registerRequestDto.PANCardFile != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(registerRequestDto.PANCardFile.FileName);
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await registerRequestDto.PANCardFile.CopyToAsync(stream);
                }
                
                var request = HttpContext.Request;
                var domain = $"{request.Scheme}://{request.Host}";
                registerRequestDto.PANCardUrl = $"{domain}/uploads/{fileName}";
            }

            var userDomainModel = _mapper.Map<User>(registerRequestDto);

            var user = await _userRepository.RegisterAsync(userDomainModel, registerRequestDto.Password);

            if (user == null)
            {
                return BadRequest(new { Message = "Something went wrong" });
            }

            return Ok(new { Message = "User registered successfully! Please login." });
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto)
        {
            var user = await _userRepository.AuthenticateAsync(loginRequestDto.Username, loginRequestDto.Password);

            if (user == null)
            {
                return BadRequest(new { Message = "Username or Password incorrect" });
            }

            var jwtToken = _tokenRepository.CreateJWTToken(user);

            var response = new LoginResponseDto
            {
                JwtToken = jwtToken,
                Username = user.Username,
                Role = user.Role
            };

            return Ok(response);
        }
    }
}

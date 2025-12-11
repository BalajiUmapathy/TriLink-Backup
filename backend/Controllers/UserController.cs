using AutoMapper;
using Backend.Models.Domain;
using Backend.Models.DTO;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound();

            var userDto = _mapper.Map<UserProfileDto>(user);
            return Ok(userDto);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound();

            // Map updates to existing user
            _mapper.Map(updateProfileDto, user);

            var updatedUser = await _userRepository.UpdateAsync(user);
            var responseDto = _mapper.Map<UserProfileDto>(updatedUser);

            return Ok(responseDto);
        }

        private Guid GetUserId()
        {
            var idClaim = User.FindFirst("id");
            if (idClaim == null) return Guid.Empty;
            return Guid.Parse(idClaim.Value);
        }
    }
}

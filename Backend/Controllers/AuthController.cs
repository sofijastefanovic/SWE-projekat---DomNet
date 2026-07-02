using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DomNet.Models;
using DomNet.Data;

namespace DomNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        public class LoginPodaci
        {
            public string Email { get; set; }
            public string Sifra { get; set; }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginPodaci podaci)
        {
            var korisnik = await _context.Korisnici
                .FirstOrDefaultAsync(k => k.Email == podaci.Email && k.Sifra == podaci.Sifra);

            if (korisnik == null)
            {
                return Unauthorized(new { poruka = "Pogrešan email ili lozinka." });
            }

            int? studentId = null;
            int? majstorId = null;

            if (korisnik.Tip == "student")
            {
                var student = await _context.Studenti.FirstOrDefaultAsync(s => s.KorisnikId == korisnik.Id);
                if (student != null) studentId = student.Id;
            }
            else if (korisnik.Tip == "majstor")
            {
                var majstor = await _context.Majstori.FirstOrDefaultAsync(m => m.KorisnikId == korisnik.Id);
                if (majstor != null) majstorId = majstor.Id;
            }

            return Ok(new
            {
                id = korisnik.Id,
                ime = korisnik.Ime,
                email = korisnik.Email,
                tip = korisnik.Tip,
                studentId = studentId,
                majstorId = majstorId
            });
        }
    }
}
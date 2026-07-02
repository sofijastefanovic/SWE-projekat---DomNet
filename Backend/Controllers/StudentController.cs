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
    public class StudentiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(int id)
        {
            var student = await _context.Studenti.FindAsync(id);

            if (student == null)
            {
                return NotFound("Student nije pronađen.");
            }

            return Ok(student);
        }

        [HttpGet("sve")]
        public async Task<IActionResult> GetAllStudenti()
        {
            var podaci = await (from s in _context.Studenti
                                join k in _context.Korisnici on s.KorisnikId equals k.Id
                                select new
                                {
                                    id = s.Id,
                                    ime = k.Ime,
                                    email = k.Email,
                                    jmbg = s.Jmbg,
                                    telefon = s.Telefon,
                                    brIndexa = s.BrIndexa,
                                    brSobe = s.BrSobe,
                                    fakultet = s.Fakultet,
                                    smer = s.Smer,
                                    datumUseljenja = s.DatumUseljenja
                                }).ToListAsync();

            return Ok(podaci);
        }
    }
}
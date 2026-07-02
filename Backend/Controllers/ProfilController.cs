using DomNet.Data;
using DomNet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;

namespace DomNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfilController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfilController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPut("promeni-sifru")]
        public async Task<IActionResult> PromeniSifru([FromBody] PromenaSifreModel model)
        {
            if (model == null || model.KorisnikId <= 0)
                return BadRequest("Neispravni podaci.");

            var korisnik = await _context.Korisnici.FindAsync(model.KorisnikId);
            if (korisnik == null)
                return NotFound("Korisnik nije pronađen.");

            string unesenaSifra = model.TrenutnaSifra?.Trim();
            string sacuvanaSifra = korisnik.Sifra?.Trim();
            Console.WriteLine($"UNESENA: '{unesenaSifra}'");
            Console.WriteLine($"IZ BAZE: '{sacuvanaSifra}'");
            if (string.IsNullOrEmpty(unesenaSifra) || unesenaSifra != sacuvanaSifra)
                return BadRequest("Trenutna šifra nije tačna.");

            string novaSifraClean = model.NovaSifra?.Trim();

            if (string.IsNullOrWhiteSpace(novaSifraClean) || novaSifraClean.Length < 4)
                return BadRequest("Nova šifra mora imati najmanje 4 karaktera.");

            korisnik.Sifra = novaSifraClean;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Šifra je uspešno promenjena." });
        }

        [HttpGet("portir/{id}")]
        public async Task<IActionResult> GetPortirProfil(int id)
        {
            var portir = await _context.Portiri
                .Include(p => p.Korisnik)
                .FirstOrDefaultAsync(p => p.KorisnikId == id);

            if (portir == null)
                return NotFound("Portir profil nije pronađen.");

            var rezultat = new
            {
                id = portir.Id,
                korisnikId = portir.KorisnikId,
                ime = portir.Korisnik?.Ime,
                email = portir.Korisnik?.Email,
                jmbg = portir.Jmbg,
                telefon = portir.Telefon,
                pocetakRada = portir.PocetakRada
            };

            return Ok(rezultat);
        }
    public class PromenaSifreModel
    {
        public int KorisnikId { get; set; }
        public string TrenutnaSifra { get; set; }
        public string NovaSifra { get; set; }
    }
}
}
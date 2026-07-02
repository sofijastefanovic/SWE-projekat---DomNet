using DomNet.Data;
using DomNet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DomNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("korisnici")]
        public async Task<IActionResult> GetSviKorisnici()
        {
            var korisnici = await _context.Korisnici
                .OrderBy(k => k.Tip)
                .ThenBy(k => k.Ime)
                .ToListAsync();

            return Ok(korisnici);
        }

        [HttpPost("kreiraj")]
        public async Task<IActionResult> KreirajKorisnika([FromBody] KorisnikCreateModel model)
        {
            if (string.IsNullOrEmpty(model.Ime) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Sifra))
                return BadRequest("Ime, email i šifra su obavezni.");

            if (await _context.Korisnici.AnyAsync(k => k.Email.ToLower() == model.Email.ToLower()))
                return BadRequest("Korisnik sa ovim email-om već postoji.");

            var noviKorisnik = new Korisnik
            {
                Ime = model.Ime.Trim(),
                Email = model.Email.Trim(),
                Sifra = model.Sifra.Trim(),
                Tip = model.Tip,
                VremeKreiranja = DateTime.Now
            };

            _context.Korisnici.Add(noviKorisnik);
            await _context.SaveChangesAsync();

            if (model.Tip == "student")
            {
                _context.Studenti.Add(new Student
                {
                    KorisnikId = noviKorisnik.Id,
                    Jmbg = model.Jmbg ?? "N/A",
                    Telefon = model.Telefon ?? "N/A",
                    BrIndexa = model.BrIndexa ?? "N/A",
                    BrSobe = model.BrSobe,
                    Fakultet = model.Fakultet,
                    Smer = model.Smer,
                    DatumUseljenja = model.DatumUseljenja
                });
            }
            else if (model.Tip == "portir")
            {
                _context.Portiri.Add(new Portir { KorisnikId = noviKorisnik.Id, Jmbg = model.Jmbg ?? "N/A", Telefon = model.Telefon ?? "N/A" });
            }
            else if (model.Tip == "majstor")
            {
                _context.Majstori.Add(new Majstor { KorisnikId = noviKorisnik.Id, Jmbg = model.Jmbg ?? "N/A", Telefon = model.Telefon ?? "N/A" });
            }
            else if (model.Tip == "upravnik")
            {
                _context.Upravnici.Add(new Upravnik { KorisnikId = noviKorisnik.Id, Jmbg = model.Jmbg ?? "N/A", Telefon = model.Telefon ?? "N/A" });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Korisnik uspešno kreiran!", id = noviKorisnik.Id });
        }

        [HttpPut("korisnik/{id}/izmeni")]
        public async Task<IActionResult> IzmeniKorisnika(int id, [FromBody] KorisnikEditModel model)
        {
            var korisnik = await _context.Korisnici.FindAsync(id);
            if (korisnik == null) return NotFound("Korisnik nije pronađen.");

            if (string.IsNullOrEmpty(model.Ime) || string.IsNullOrEmpty(model.Email))
                return BadRequest("Ime i email su obavezni.");

            if (await _context.Korisnici.AnyAsync(k => k.Email.ToLower() == model.Email.ToLower() && k.Id != id))
                return BadRequest("Korisnik sa ovim email-om već postoji.");

            korisnik.Ime = model.Ime.Trim();
            korisnik.Email = model.Email.Trim();

            if (korisnik.Tip == "student")
            {
                var student = await _context.Studenti.FirstOrDefaultAsync(s => s.KorisnikId == id);
                if (student != null)
                {
                    if (!string.IsNullOrWhiteSpace(model.Telefon)) student.Telefon = model.Telefon.Trim();
                    if (!string.IsNullOrWhiteSpace(model.BrIndexa)) student.BrIndexa = model.BrIndexa.Trim();
                    if (model.BrSobe.HasValue) student.BrSobe = model.BrSobe.Value;
                    if (!string.IsNullOrWhiteSpace(model.Fakultet)) student.Fakultet = model.Fakultet.Trim();
                    if (!string.IsNullOrWhiteSpace(model.Smer)) student.Smer = model.Smer.Trim();
                }
            }
            else if (korisnik.Tip == "portir" || korisnik.Tip == "majstor" || korisnik.Tip == "upravnik")
            {
                dynamic zapis = null;
                if (korisnik.Tip == "portir") zapis = await _context.Portiri.FirstOrDefaultAsync(p => p.KorisnikId == id);
                else if (korisnik.Tip == "majstor") zapis = await _context.Majstori.FirstOrDefaultAsync(m => m.KorisnikId == id);
                else if (korisnik.Tip == "upravnik") zapis = await _context.Upravnici.FirstOrDefaultAsync(u => u.KorisnikId == id);

                if (zapis != null && !string.IsNullOrWhiteSpace(model.Telefon))
                {
                    zapis.Telefon = model.Telefon.Trim();
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Podaci korisnika su uspešno ažurirani!" });
        }

        [HttpDelete("korisnik/{id}")]
        public async Task<IActionResult> ObrisiKorisnika(int id)
        {
            var korisnik = await _context.Korisnici.FindAsync(id);
            if (korisnik == null) return NotFound("Korisnik nije pronađen.");

            _context.Korisnici.Remove(korisnik);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Korisnik je uspešno obrisan." });
        }

        [HttpPut("korisnik/{id}/reset-sifre")]
        public async Task<IActionResult> ResetujSifru(int id)
        {
            var korisnik = await _context.Korisnici.FindAsync(id);
            if (korisnik == null) return NotFound("Korisnik nije pronađen.");

            string novaSifra = $"{korisnik.Tip.ToLower()}111";
            korisnik.Sifra = novaSifra;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Šifra za korisnika {korisnik.Ime} je resetovana na: {novaSifra}" });
        }
    }

    public class KorisnikCreateModel
    {
        public string Ime { get; set; }
        public string Email { get; set; }
        public string Sifra { get; set; }
        public string Tip { get; set; }

        public string Jmbg { get; set; }
        public string Telefon { get; set; }
        public string BrIndexa { get; set; }
        public int? BrSobe { get; set; }
        public string Fakultet { get; set; }
        public string Smer { get; set; }
        public DateTime? DatumUseljenja { get; set; }
    }

    public class KorisnikEditModel
    {
        public string Ime { get; set; }
        public string Email { get; set; }
        public string Telefon { get; set; }
        public int? BrSobe { get; set; }
        public string BrIndexa { get; set; }
        public string Fakultet { get; set; }
        public string Smer { get; set; }
    }
}
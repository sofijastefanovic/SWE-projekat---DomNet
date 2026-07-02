using System;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DomNet.Data;
using DomNet.Models;
using System.Collections.Generic;

namespace DomNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VesMasineController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VesMasineController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSveMasine()
        {
            var masine = await _context.VesMasine.ToListAsync();
            return Ok(masine);
        }

        [HttpGet("termini/{masinaId}/{datum}")]
        public IActionResult GetTerminiZaDan(int masinaId, DateTime datum)
        {
     
            var maxDatum = DateTime.Today.AddDays(30);
            if (datum.Date < DateTime.Today || datum.Date > maxDatum)
            {
                return BadRequest("Datum mora biti u opsegu od danas do narednih 30 dana.");
            }

            var fiksniSlotovi = new List<TimeSpan>
            {
                new TimeSpan(6, 0, 0),    // 06:00 - 09:00
                new TimeSpan(9, 30, 0),   // 09:30 - 12:30
                new TimeSpan(13, 0, 0),   // 13:00 - 16:00
                new TimeSpan(16, 30, 0),  // 16:30 - 19:30
                new TimeSpan(20, 0, 0)    // 20:00 - 23:00
            };

            var rezultati = new List<object>();

            foreach (var pocetak in fiksniSlotovi)
            {
                var kraj = pocetak.Add(new TimeSpan(3, 0, 0)); // svaki termin traje 3 sata

                // Provera da li je termin zauzet
                var rezervacija = _context.Rezervacije
                    .FirstOrDefault(r => r.MasinaId == masinaId &&
                         r.Datum.Date == datum.Date &&
                         r.Slot == fiksniSlotovi.IndexOf(pocetak) + 1);

                string status = "slobodno";
                if (rezervacija != null)
                {
                    status = rezervacija.Status; // "na cekanju" ili "odobreno"
                }

                rezultati.Add(new
                {
                    masinaId = masinaId,
                    datum = datum.Date,
                    slot = fiksniSlotovi.IndexOf(pocetak) + 1,
                    status = status,
                    vremeOd = pocetak.ToString(@"hh\:mm"),
                    vremeDo = kraj.ToString(@"hh\:mm")
                });
            }

            return Ok(rezultati);
        }


        [HttpPost("rezervisi")]
        public async Task<IActionResult> PosaljiZahtev([FromBody] RezervacijaZahtev zahtev)
        {
            var vecPostoji = await _context.Rezervacije.AnyAsync(r =>
                r.MasinaId == zahtev.MasinaId &&
                r.Datum.Date == zahtev.Datum.Date &&
                r.Slot == zahtev.Slot &&
                r.Status != "odbijeno");

            if (vecPostoji)
            {
                return BadRequest("Termin je već zauzet ili na čekanju.");
            }

            var rezervacija = new Rezervacija
            {
                StudentId = zahtev.StudentId,
                MasinaId = zahtev.MasinaId,
                Datum = zahtev.Datum.Date,
                Slot = zahtev.Slot,
                Status = "na cekanju",
                DatumZahteva = DateTime.Now
            };

            _context.Rezervacije.Add(rezervacija);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Zahtev uspešno poslat." });
        }

        [HttpGet("moje-rezervacije/{studentId}")]
        public async Task<IActionResult> GetMojeRezervacije(int studentId)
        {
            var rezervacije = await _context.Rezervacije
                .Include(r => r.VesMasina)
                .Where(r => r.StudentId == studentId)
                .OrderByDescending(r => r.DatumZahteva)
                .ToListAsync();

            return Ok(rezervacije);
        }

        [HttpGet("zahtevi")]
        public async Task<IActionResult> GetSviZahtevi()
        {
            var zahtevi = await _context.Rezervacije
                .Include(r => r.Student)
                    .ThenInclude(s => s.Korisnik)
                .Include(r => r.VesMasina)
                .OrderByDescending(r => r.DatumZahteva)
                .ToListAsync();

            return Ok(zahtevi);
        }

        [HttpPut("zahtev/{id}/odobri")]
        public async Task<IActionResult> OdobriZahtev(int id)
        {
            var rezervacija = await _context.Rezervacije.FindAsync(id);
            if (rezervacija == null) return NotFound();

            rezervacija.Status = "odobreno";
            rezervacija.DatumOdgovora = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Zahtev je odobren!" });
        }

        [HttpPut("zahtev/{id}/odbij")]
        public async Task<IActionResult> OdbijZahtev(int id)
        {
            var rezervacija = await _context.Rezervacije.FindAsync(id);
            if (rezervacija == null) return NotFound();

            rezervacija.Status = "odbijeno";
            rezervacija.DatumOdgovora = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Zahtev je odbijen!" });
        }
    }

    public class RezervacijaZahtev
    {
        public int StudentId { get; set; }
        public int MasinaId { get; set; }
        public DateTime Datum { get; set; }
        public int Slot { get; set; }
    }
}
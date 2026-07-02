using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using DomNet.Data;
using DomNet.Models;

namespace DomNet.Controllers
{
    [Route("api/pocetna")]
    [ApiController]
    public class PocetnaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PocetnaController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet("vazna")]
        public async Task<IActionResult> GetVaznaObavestenja()
        {
            var vaznaObavestenja = await _context.Obavestenja
                .Include(o => o.Korisnik)
                .Where(o => o.Tip == "vazno")
                .OrderByDescending(o => o.Datum)
                .Select(o => new
                {
                    id = o.Id,
                    naziv = o.Naziv,
                    tekst = o.Tekst,
                    tip = o.Tip,
                    datum = o.Datum,
                    autorId = o.AutorId,
                    korisnik = o.Korisnik != null ? new
                    {
                        ime = o.Korisnik.Ime,
                        uloga = o.Korisnik.Tip
                    } : null
                })
                .ToListAsync();

            return Ok(vaznaObavestenja);
        }


        [HttpPost("kreiraj")]
        public async Task<IActionResult> KreirajVaznoObavestenje([FromBody] Obavestenje novoObavestenje)
        {
            if (novoObavestenje == null || string.IsNullOrEmpty(novoObavestenje.Naziv) || string.IsNullOrEmpty(novoObavestenje.Tekst))
            {
                return BadRequest("Naslov i tekst obaveštenja su obavezni.");
            }

         
            var autor = await _context.Korisnici.FindAsync(novoObavestenje.AutorId);
            if (autor == null)
            {
                return BadRequest("Autor (korisnik) nije pronađen.");
            }

            
            if (autor.Tip.ToLower() != "upravnik" && autor.Tip.ToLower() != "portir")
            {
                return StatusCode(403, "Samo upravnici i portiri mogu da objavljuju važna obaveštenja.");
            }

            novoObavestenje.Tip = "vazno";
            novoObavestenje.Datum = DateTime.Now;

            _context.Obavestenja.Add(novoObavestenje);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Važno obaveštenje uspešno postavljeno.", podaci = novoObavestenje });
        }

        [HttpDelete("obrisi/{id}")]
        public async Task<IActionResult> ObrisiObavestenje(int id)
        {
           
            var obavestenje = await _context.Obavestenja.FindAsync(id);
            if (obavestenje == null)
            {
                return NotFound("Obaveštenje ne postoji u bazi podataka.");
            }

           
            var povezaniKomentari = _context.Komentari.Where(k => k.ObavestenjeId == id);
            _context.Komentari.RemoveRange(povezaniKomentari);

         
            var povezaneReakcije = _context.Reakcije.Where(r => r.ObavestenjeId == id);
            _context.Reakcije.RemoveRange(povezaneReakcije);

           
            _context.Obavestenja.Remove(obavestenje);

          
            await _context.SaveChangesAsync();

            return Ok(new { message = "Obaveštenje i svi povezani podaci su uspešno obrisani." });
        }
    }
}
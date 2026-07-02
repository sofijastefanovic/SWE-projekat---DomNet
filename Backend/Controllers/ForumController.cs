using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using DomNet.Data;
using DomNet.Models;

namespace DomNet.Controllers
{
    [Route("api/forum")]
    [ApiController]
    public class ForumController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ForumController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetForumObjave()
        {
            var objave = await _context.Obavestenja
                .Include(o => o.Korisnik)
                .Where(o => o.Tip == "obicno")
                .OrderByDescending(o => o.Datum)
                .ToListAsync();

            var sviKomentari = await _context.Komentari.ToListAsync();

            var sviKorisnici = await _context.Korisnici.ToListAsync();

            var rezultat = objave.Select(o => new
            {
                id = o.Id,
                naziv = o.Naziv,
                tekst = o.Tekst,
                datum = o.Datum,
                autorId = o.AutorId,
                brojLajkova = _context.Reakcije.Count(r => r.ObavestenjeId == o.Id),

                korisnik = o.Korisnik != null ? new
                {
                    ime = o.Korisnik.Ime
                } : null,

                komentari = sviKomentari
                    .Where(k => k.ObavestenjeId == o.Id)
                    .Select(k => {
                        var autorKomentara = sviKorisnici.FirstOrDefault(korisnikBaza => korisnikBaza.Id == k.AutorId);

                        return new
                        {
                            id = k.Id,
                            tekst = k.Tekst,
                            autorId = k.AutorId,
                            korisnik = autorKomentara != null ? new
                            {
                                ime = autorKomentara.Ime
                            } : null
                        };
                    }).ToList()
            }).ToList();

            return Ok(rezultat);
        }

        [HttpPost]
        public async Task<IActionResult> CreateObjava([FromBody] Obavestenje novaObjava)
        {
            if (novaObjava == null || string.IsNullOrEmpty(novaObjava.Naziv) || string.IsNullOrEmpty(novaObjava.Tekst))
                return BadRequest("Podaci objave su neispravni.");

            novaObjava.Tip = "obicno";
            novaObjava.Datum = DateTime.Now;

            _context.Obavestenja.Add(novaObjava);
            await _context.SaveChangesAsync();

            return Ok(novaObjava);
        }

        [HttpPost("komentar")]
        public async Task<IActionResult> DodajKomentar([FromBody] Komentar komentar)
        {
            if (komentar == null || string.IsNullOrEmpty(komentar.Tekst))
                return BadRequest("Tekst komentara ne može biti prazan.");

            komentar.Datum = DateTime.Now;

            _context.Komentari.Add(komentar);
            await _context.SaveChangesAsync();

            return Ok(komentar);
        }

        [HttpPost("lajk")]
        public async Task<IActionResult> LajkujObjavu([FromBody] ReakcijaDTO podaci)
        {
            if (podaci == null || podaci.ObavestenjeId <= 0 || podaci.AutorId <= 0)
                return BadRequest("Neispravni podaci za lajk.");

     
            var postojeciLajk = await _context.Reakcije
                .FirstOrDefaultAsync(r => r.ObavestenjeId == podaci.ObavestenjeId && r.AutorId == podaci.AutorId && r.TipReakcije == "lajk");

            if (postojeciLajk != null)
            {
               
                _context.Reakcije.Remove(postojeciLajk);
                await _context.SaveChangesAsync();
                return Ok(new { poruka = "Lajk uklonjen.", lajkovano = false });
            }
            else
            {
             
                var novaReakcija = new Reakcija
                {
                    ObavestenjeId = podaci.ObavestenjeId,
                    AutorId = podaci.AutorId,
                    TipReakcije = "lajk",
                    Datum = DateTime.Now
                };

                _context.Reakcije.Add(novaReakcija);
                await _context.SaveChangesAsync();
                return Ok(new { poruka = "Objava lajkovana.", lajkovano = true });
            }
        }
    }

    
    public class ReakcijaDTO
    {
        public int ObavestenjeId { get; set; }
        public int AutorId { get; set; }
    }
}
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DomNet.Data;
using DomNet.Models;
using System;
using System.Collections.Generic;

namespace DomNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KvaroviController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KvaroviController(AppDbContext context)
        {
            _context = context;
        }

        private object FormirajRezultat(Kvar k, string imeKorisnika, string tipKorisnika, string telefon)
        {
            return new
            {
                k.Id,
                k.KorisnikId,
                ImePrezime = tipKorisnika == "portir" ? $"Portir ({imeKorisnika})" : imeKorisnika,
                Telefon = telefon,
                k.VrstaKvara,
                k.Lokacija,
                k.Opis,
                k.Status,
                k.DatumPrijave,
                k.DatumZakazivanja,
                k.DatumPopravke,
                k.VremeZakazivanja,
                k.BrojIzmena
            };
        }

        [HttpGet("novi")]
        public async Task<IActionResult> GetNoviKvarovi()
        {
            var podaci = await (from k in _context.Kvarovi
                                join u in _context.Korisnici on k.KorisnikId equals u.Id
                                join s in _context.Studenti on u.Id equals s.KorisnikId into studentGroup
                                from s in studentGroup.DefaultIfEmpty()
                                join p in _context.Portiri on u.Id equals p.KorisnikId into portirGroup
                                from p in portirGroup.DefaultIfEmpty()
                                where k.Status == "na čekanju"
                                select new { k, u.Ime, u.Tip, Telefon = s != null ? s.Telefon : (p != null ? p.Telefon : "Nema") }).ToListAsync();

            return Ok(podaci.Select(x => FormirajRezultat(x.k, x.Ime, x.Tip, x.Telefon)));
        }

        [HttpGet("zakazani")]
        public async Task<IActionResult> GetZakazaniKvarovi()
        {
            var podaci = await (from k in _context.Kvarovi
                                join u in _context.Korisnici on k.KorisnikId equals u.Id
                                join s in _context.Studenti on u.Id equals s.KorisnikId into studentGroup
                                from s in studentGroup.DefaultIfEmpty()
                                join p in _context.Portiri on u.Id equals p.KorisnikId into portirGroup
                                from p in portirGroup.DefaultIfEmpty()
                                where k.Status == "zakazano" || k.Status == "završeno"
                                select new { k, u.Ime, u.Tip, Telefon = s != null ? s.Telefon : (p != null ? p.Telefon : "Nema") }).ToListAsync();

            return Ok(podaci.Select(x => FormirajRezultat(x.k, x.Ime, x.Tip, x.Telefon)));
        }

        [HttpGet("sve")]
        public async Task<IActionResult> GetSveKvarove()
        {
            var podaci = await (from k in _context.Kvarovi
                                join u in _context.Korisnici on k.KorisnikId equals u.Id
                                join s in _context.Studenti on u.Id equals s.KorisnikId into studentGroup
                                from s in studentGroup.DefaultIfEmpty()
                                join p in _context.Portiri on u.Id equals p.KorisnikId into portirGroup
                                from p in portirGroup.DefaultIfEmpty()
                                select new { k, u.Ime, u.Tip, Telefon = s != null ? s.Telefon : (p != null ? p.Telefon : "Nema") }).ToListAsync();

            return Ok(podaci.Select(x => FormirajRezultat(x.k, x.Ime, x.Tip, x.Telefon)));
        }

        [HttpPost("prijava")]
        public async Task<IActionResult> SubmitKvar([FromBody] Kvar noviKvar)
        {
            if (noviKvar == null) return BadRequest("Podaci su neispravni.");

            noviKvar.DatumPrijave = DateTime.Now;
            noviKvar.Status = "na čekanju";

            _context.Kvarovi.Add(noviKvar);
            await _context.SaveChangesAsync();
            return Ok(noviKvar);
        }

        [HttpPut("azuriraj-status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string noviStatus)
        {
            var kvar = await _context.Kvarovi.FindAsync(id);
            if (kvar == null) return NotFound("Kvar nije pronađen.");

            kvar.Status = noviStatus;
            if (noviStatus == "završeno") kvar.DatumPopravke = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(kvar);
        }

        [HttpPut("zakazi/{id}")]
        public async Task<IActionResult> ZakaziKvar(int id, [FromBody] DateTime datum)
        {
            var kvar = await _context.Kvarovi.FindAsync(id);
            if (kvar == null) return NotFound("Kvar nije pronađen.");

            kvar.Status = "zakazano";
            kvar.DatumZakazivanja = datum;
            kvar.VremeZakazivanja = DateTime.Now;

            kvar.BrojIzmena += 1;
            await _context.SaveChangesAsync();
            return Ok(kvar);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKvar(int id)
        {
            var kvar = await _context.Kvarovi.FindAsync(id);
            if (kvar == null) return NotFound("Kvar nije pronađen.");

            _context.Kvarovi.Remove(kvar);
            await _context.SaveChangesAsync();

            return Ok(new { poruka = "Kvar je uspešno obrisan." });
        }
    }
}
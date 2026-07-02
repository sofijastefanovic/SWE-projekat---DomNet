using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DomNet.Data;
using DomNet.Models;

namespace DomNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IzvestajController : ControllerBase
    {
        private readonly AppDbContext _context;

        public IzvestajController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Izvestaj>>> GetIzvestaji()
        {
            return await _context.Izvestaji.ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Izvestaj>> GetIzvestaj(int id)
        {
            var izvestaj = await _context.Izvestaji.FindAsync(id);

            if (izvestaj == null)
            {
                return NotFound(new { poruka = $"Izveštaj sa ID-jem {id} nije pronađen." });
            }

            return izvestaj;
        }

        [HttpPost]
        public async Task<ActionResult<Izvestaj>> PostIzvestaj([FromBody] Izvestaj izvestaj)
        {
            if (izvestaj == null)
            {
                return BadRequest(new { poruka = "Podaci o izveštaju nisu validni." });
            }

            if (izvestaj.Datum == DateTime.MinValue)
            {
                izvestaj.Datum = DateTime.Now;
            }

            _context.Izvestaji.Add(izvestaj);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetIzvestaj), new { id = izvestaj.Id }, izvestaj);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutIzvestaj(int id, [FromBody] Izvestaj izvestaj)
        {
            if (id != izvestaj.Id)
            {
                return BadRequest(new { poruka = "ID u URL-u i ID u telu zahteva se ne poklapaju." });
            }

            _context.Entry(izvestaj).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IzvestajExists(id))
                {
                    return NotFound(new { poruka = $"Izveštaj sa ID-jem {id} više ne postoji u bazi." });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { poruka = "Izveštaj je uspešno izmenjen.", podaci = izvestaj });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIzvestaj(int id)
        {
            var izvestaj = await _context.Izvestaji.FindAsync(id);
            if (izvestaj == null)
            {
                return NotFound(new { poruka = $"Izveštaj sa ID-jem {id} nije pronađen." });
            }

            _context.Izvestaji.Remove(izvestaj);
            await _context.SaveChangesAsync();

            return Ok(new { poruka = "Izveštaj je uspešno obrisan." });
        }

        private bool IzvestajExists(int id)
        {
            return _context.Izvestaji.Any(e => e.Id == id);
        }
    }
}
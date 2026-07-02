using Microsoft.EntityFrameworkCore;
using DomNet.Models;

namespace DomNet.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        //Korisnici
        public DbSet<Korisnik> Korisnici { get; set; }
       public DbSet<Student> Studenti { get; set; }
       //public DbSet<Admin> Admini { get; set; }
       public DbSet<Portir> Portiri { get; set; }
       public DbSet<Upravnik> Upravnici { get; set; }
        public DbSet<Majstor> Majstori { get; set; }

        // Obaveštenja i Forum
       public DbSet<Obavestenje> Obavestenja { get; set; }
       public DbSet<Komentar> Komentari { get; set; }
      public DbSet<Reakcija> Reakcije { get; set; }
      public DbSet<Izvestaj> Izvestaji { get; set; }

        // Veš mašine i Rezervacije
       public DbSet<VesMasina> VesMasine { get; set; }
       public DbSet<Termin> Termini { get; set; }
       public DbSet<Rezervacija> Rezervacije { get; set; }

        // Kvarovi
        public DbSet<Kvar> Kvarovi { get; set; }
    }
}
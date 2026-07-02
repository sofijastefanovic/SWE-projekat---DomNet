using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("upravnik")]
    public class Upravnik
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("korisnik_id")]
        public int KorisnikId { get; set; }

        [ForeignKey("KorisnikId")]
        public Korisnik Korisnik { get; set; } = null!;

        [Column("jmbg")]
        public string Jmbg { get; set; } = string.Empty;

        [Column("telefon")]
        public string Telefon { get; set; } = string.Empty;

        [Column("sektor")]
        public int? Sektor { get; set; }

        [Column("broj_kancelarije")]
        public int? BrojKancelarije { get; set; }

        [Column("pocetak_rada")]
        public DateTime? PocetakRada { get; set; }
    }
}
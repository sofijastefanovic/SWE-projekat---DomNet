using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("portir")]
    public class Portir
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

        [Column("pocetak_rada")]
        public DateTime? PocetakRada { get; set; }
    }
}
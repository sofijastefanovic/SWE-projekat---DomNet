using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("majstor")]
    public class Majstor
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("korisnik_id")]
        public int KorisnikId { get; set; }

        [Required]
        [Column("jmbg")]
        public string Jmbg { get; set; }

        [Required]
        [Column("telefon")]
        public string Telefon { get; set; }

        [Column("pocetak_rada")]
        public DateTime? PocetakRada { get; set; }
    }
}
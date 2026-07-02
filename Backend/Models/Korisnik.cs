using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("korisnik")] 
    public class Korisnik
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("ime")]
        public string Ime { get; set; }

        [Required]
        [Column("email")]
        public string Email { get; set; }

        [Required]
        [Column("sifra")]
        public string Sifra { get; set; }

        [Required]
        [Column("tip")]
        public string Tip { get; set; }

        [Column("vreme_kreiranja")]
        public DateTime VremeKreiranja { get; set; }
    }
}
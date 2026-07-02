using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("student")]
    public class Student
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

        [Column("br_indexa")]
        public string BrIndexa { get; set; } = string.Empty;

        [Column("br_sobe")]
        public int? BrSobe { get; set; }

        [Column("fakultet")]
        public string? Fakultet { get; set; }

        [Column("smer")]
        public string? Smer { get; set; }

        [Column("datum_useljenja")]
        public DateTime? DatumUseljenja { get; set; }
    }
}

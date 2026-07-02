using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("obavestenje")]
    public class Obavestenje
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("naziv")]
        public string Naziv { get; set; }

        [Required]
        [Column("tekst")]
        public string Tekst { get; set; }

        [Column("tip")]
        public string Tip { get; set; } = "obicno";

        [Column("autor_id")]
        public int AutorId { get; set; }

        [ForeignKey("AutorId")]
        public virtual Korisnik Korisnik { get; set; }

        [Column("datum")]
        public DateTime Datum { get; set; } = DateTime.Now;
    }
}
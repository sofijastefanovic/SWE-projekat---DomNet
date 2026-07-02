using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("komentar")]
    public class Komentar
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("obavestenje_id")]
        public int ObavestenjeId { get; set; }

        [Column("autor_id")]
        public int AutorId { get; set; }

        [Required]
        [Column("tekst")]
        public string Tekst { get; set; }

        [Column("datum")]
        public DateTime Datum { get; set; } = DateTime.Now;
    }
}
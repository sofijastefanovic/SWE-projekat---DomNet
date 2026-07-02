using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("izvestaj")]
    public class Izvestaj
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("naziv")]
        [StringLength(200)]
        public string Naziv { get; set; }

        [Column("tekst")]
        public string Tekst { get; set; }

        [Column("tip")]
        [StringLength(20)]
        public string Tip { get; set; }

        [Column("autor_id")]
        public int AutorId { get; set; }

        [Column("datum")]
        public DateTime Datum { get; set; } = DateTime.Now;
    }
}
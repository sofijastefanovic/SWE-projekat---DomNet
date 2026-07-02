using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("reakcija")]
    public class Reakcija
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("obavestenje_id")]
        public int ObavestenjeId { get; set; }

        [Column("autor_id")]
        public int AutorId { get; set; }

        [Column("tip_reakcije")]
        public string TipReakcije { get; set; }

        [Column("datum")]
        public DateTime Datum { get; set; } = DateTime.Now;
    }
}
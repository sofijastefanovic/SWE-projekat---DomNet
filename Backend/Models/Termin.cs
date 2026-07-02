using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("termin")]
    public class Termin
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("masina_id")]
        public int MasinaId { get; set; }

        [ForeignKey("MasinaId")]
        public VesMasina VesMasina { get; set; } = null!;

        [Required]
        [Column("datum")]
        public DateTime Datum { get; set; }  

        [Required]
        [Column("vreme_od")]
        public TimeSpan VremeOd { get; set; }

        [Required]
        [Column("vreme_do")]
        public TimeSpan VremeDo { get; set; }
    }
}

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("rezervacija")]
    public class Rezervacija
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("student_id")]
        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;

        [Column("masina_id")]
        public int MasinaId { get; set; }

        [ForeignKey("MasinaId")]
        public VesMasina VesMasina { get; set; } = null!;

        [Column("datum")]
        public DateTime Datum { get; set; }

        [Column("slot")]
        public int Slot { get; set; }

        [Column("portir_id")]
        public int? PortirId { get; set; }

        [ForeignKey("PortirId")]
        public Portir? Portir { get; set; }

        [Column("status")]
        public string Status { get; set; } = "na cekanju";

        [Column("datum_zahteva")]
        public DateTime DatumZahteva { get; set; } = DateTime.Now;

        [Column("datum_odgovora")]
        public DateTime? DatumOdgovora { get; set; }
    }
}

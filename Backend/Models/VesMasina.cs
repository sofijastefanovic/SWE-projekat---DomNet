using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("ves_masina")]
    public class VesMasina
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("naziv")]
        public string Naziv { get; set; } = string.Empty;

        [Required]
        [Column("lokacija")]
        public string Lokacija { get; set; } = string.Empty;

        [Column("status")]
        public string Status { get; set; } = "dostupna";  
    }
}

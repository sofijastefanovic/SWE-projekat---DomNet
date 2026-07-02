using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomNet.Models
{
    [Table("kvar")]
    public class Kvar
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("korisnik_id")]
        public int KorisnikId { get; set; }

        [Column("majstor_id")]
        public int? MajstorId { get; set; }

        [Required]
        [Column("vrsta_kvara")]
        public string VrstaKvara { get; set; }

        [Required]
        [Column("lokacija")]
        public string Lokacija { get; set; }

        [Column("opis")]
        public string Opis { get; set; }

        [Required]
        [Column("status")]
        public string Status { get; set; }

        [Column("datum_prijave")]
        public DateTime DatumPrijave { get; set; }

        [Column("datum_popravke")]
        public DateTime? DatumPopravke { get; set; }

        [Column("datum_zakazivanja")]
        public DateTime? DatumZakazivanja { get; set; }

        [Column("vreme_zakazivanja")]
        public DateTime? VremeZakazivanja { get; set; }

        [Column("broj_izmena")]
        public int BrojIzmena { get; set; }
    }
}
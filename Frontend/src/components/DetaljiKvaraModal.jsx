import React, { useState, useEffect } from 'react'; 

const DetaljiKvaraModal = ({ kvar, onClose, isMajstor = true, onZakaziTerminKlik }) => {
  const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setSirinaEkrana(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!kvar) return null;

  const jeMaliEkran = sirinaEkrana <= 600;

  const ocistiVrstuKvara = (tekst) => {
    if (!tekst) return '';
    return tekst.split('(')[0].trim();
  };

  const formatirajDatum = (datumString) => {
    if (!datumString) return 'Nije urgentno';
    const d = new Date(datumString);
    if (d.getFullYear() === 1970) return 'Nije urgentno';
    return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
  };

  const formatirajImePrezime = (tekst) => {
    if (!tekst) return 'Nije upisano';
    return tekst.replace(/([a-zšđčćž])([A-ZŠĐČĆŽ])/g, '$1 $2');
  };

  const odrediBojuStatusa = (status, datumZakazivanja) => {
    if (!status) return '#007bff';
    const statusLower = status.toLowerCase();
    if (statusLower === 'završeno') return 'green';
    if (statusLower === 'zakazano') {
      const trenutnoVreme = new Date().getTime();
      const jePrekoracen = datumZakazivanja && new Date(datumZakazivanja).getTime() + (2 * 60 * 60 * 1000) < trenutnoVreme;
      return jePrekoracen ? '#dc3545' : '#fd7e14'; 
    }
    return '#007bff'; 
  };

  const prikaziTekstStatusa = (status, datumZakazivanja) => {
    if (!status) return 'Na čekanju';
    const statusLower = status.toLowerCase();
    if (statusLower === 'zakazano') {
      const trenutnoVreme = new Date().getTime();
      if (datumZakazivanja && new Date(datumZakazivanja).getTime() + (2 * 60 * 60 * 1000) < trenutnoVreme) {
        return 'Prekoračeno';
      }
    }
    return status;
  };

  const trenutniStatus = kvar.status || kvar.Status || '';
  const statusLower = trenutniStatus.toLowerCase();

  return (
    <div 
      onClick={onClose} 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1200, 
        padding: jeMaliEkran ? '12px' : '20px', 
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{
          backgroundColor: 'white', 
          padding: jeMaliEkran ? '22px 16px' : '30px', 
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)', 
          width: '100%', 
          maxWidth: '500px',
          maxHeight: '90vh', 
          overflowY: 'auto', 
          position: 'relative', 
          textAlign: 'left', 
          fontFamily: 'Arial, sans-serif',
          boxSizing: 'border-box'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '15px', right: '15px',
            border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer',
            color: '#333', fontWeight: 'bold'
          }}
        >
          X
        </button>

        <h3 style={{ color: '#007bff', marginTop: 0, borderBottom: '2px solid #007bff', paddingBottom: '10px', fontSize: jeMaliEkran ? '18px' : '20px' }}>
          Detaljan pregled kvara
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px', fontSize: jeMaliEkran ? '14px' : '15px' }}>
          
          {isMajstor && (
            <>
              <p><strong>Prijavio:</strong> {formatirajImePrezime(kvar.imePrezime || kvar.ImePrezime)}</p>
              <p><strong>Kontakt telefon:</strong> {kvar.telefon || kvar.Telefon || 'Nema telefona'}</p>
            </>
          )}
          
          <p><strong>Lokacija:</strong> Soba {kvar.lokacija || kvar.Lokacija}</p>
          <p><strong>Vrsta kvara:</strong> {ocistiVrstuKvara(kvar.vrstaKvara || kvar.VrstaKvara)}</p>
          
          <p>
            <strong>Trenutni status:</strong>{' '}
            <span style={{ fontWeight: 'bold', color: odrediBojuStatusa(trenutniStatus, kvar.datumZakazivanja || kvar.DatumZakazivanja) }}>
              {prikaziTekstStatusa(trenutniStatus, kvar.datumZakazivanja || kvar.DatumZakazivanja)}
              {statusLower === 'zakazano' && ` (za ${formatirajDatum(kvar.datumZakazivanja || kvar.DatumZakazivanja)})`}
            </span>
          </p>
          
          <p><strong>Opis problema:</strong></p>
          <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '6px', fontStyle: 'italic', color: '#555', borderLeft: '3px solid #ccc', wordBreak: 'break-word' }}>
            "{kvar.opis || kvar.Opis || 'Nema dodatnog opisa.'}"
          </div>
          
          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />

          <p style={{ fontSize: '13.5px', color: '#555' }}><strong>Vreme prijave:</strong> {formatirajDatum(kvar.datumPrijave || kvar.DatumPrijave)}</p>
          
          {statusLower !== 'na čekanju' && (
            <p style={{ fontSize: '13.5px', color: '#555' }}>
              <strong>Vreme zakazivanja:</strong> {formatirajDatum(kvar.vremeZakazivanja || kvar.VremeZakazivanja || kvar.datumZakazivanja || kvar.DatumZakazivanja)}
            </p>
          )}

          {statusLower === 'završeno' && (
            <p style={{ fontSize: '13.5px', color: 'green', fontWeight: 'bold' }}><strong>Vreme popravke:</strong> {formatirajDatum(kvar.datumPopravke || kvar.DatumPopravke)}</p>
          )}

          {isMajstor && statusLower === 'na čekanju' && onZakaziTerminKlik && (
            <button
              onClick={() => { onClose(); onZakaziTerminKlik(kvar); }}
              style={{ marginTop: '10px', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', width: '100%', transition: 'background-color 0.2s ease' }}
            >
               Zakaži termin popravke
            </button>
          )}

          {isMajstor && statusLower === 'zakazano' && onZakaziTerminKlik && (
            <button
              onClick={() => { onClose(); onZakaziTerminKlik(kvar); }}
              style={{ marginTop: '10px', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', width: '100%', transition: 'background-color 0.2s ease' }}
            >
               Novi termin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetaljiKvaraModal;
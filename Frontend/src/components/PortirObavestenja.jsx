import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortirMeni from './PortirMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const PortirObavestenja = () => {
  const [obavestenja, setObavestenja] = useState([]);
  const [poruka, setPoruka] = useState('');
  const navigate = useNavigate();

  
  const ocistiVrstuKvara = (tekst) => {
    if (!tekst) return '';
    return tekst.split('(')[0].trim();
  };

  
  const formatirajDatum = (datumString) => {
    if (!datumString) return 'Nije definisano';
    const d = new Date(datumString);
    return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
  };

 
  const fetchObavestenja = async () => {
    try {
      const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
      if (!sacuvaniKorisnik) return;
      const korisnikPodaci = JSON.parse(sacuvaniKorisnik);
      const mojId = korisnikPodaci.id;

        const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/sve`);
      if (response.ok) {
        const podaci = await response.json();
        
        const promenjeniKvarovi = podaci.filter(k => 
          (k.status || k.Status) && 
          (k.status || k.Status).toLowerCase() !== 'na čekanju' &&
          (k.korisnikId || k.KorisnikId) === mojId
        );
        
        const sortirani = promenjeniKvarovi.sort((a, b) => {
          const vremeA = a.datumPopravke || a.DatumPopravke || a.vremeZakazivanja || a.VremeZakazivanja || a.datumZakazivanja || a.DatumZakazivanja || a.datumPrijave || a.DatumPrijave;
          const vremeB = b.datumPopravke || b.DatumPopravke || b.vremeZakazivanja || b.VremeZakazivanja || b.datumZakazivanja || b.DatumZakazivanja || b.datumPrijave || b.DatumPrijave;
          return new Date(vremeB) - new Date(vremeA);
        });

        setObavestenja(sortirani);
      }
    } catch (error) {
      console.error('Greška pri učitavanju obaveštenja:', error);
      setPoruka('Nije moguće učitati obaveštenja.');
    }
  };

  
  useEffect(() => {
    localStorage.setItem('portirZadnjaPoseta', new Date().getTime().toString());
    fetchObavestenja();
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: '30px', backgroundColor: '#f9f9f9', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }}>
      <PortirMeni />

      <h2 style={{ color: '#333', marginBottom: '20px', textAlign: 'left' }}>Moja obaveštenja</h2>

      {poruka && <p style={{ color: 'red' }}>{poruka}</p>}

      {obavestenja.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '30px' }}>
          Nemate novih obaveštenja o statusu kvarova koje ste prijavili.
        </p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {obavestenja.map((kvar) => {
            const statusLower = (kvar.status || kvar.Status)?.toLowerCase();
            const jeZavrseno = statusLower === 'završeno';
            const brojIzmenaKljuč = kvar.brojIzmena || kvar.BrojIzmena || 0;
            
            let bojaTrake = '#007bff';
            let bojaTekstaStatusa = '#007bff';
            let pozadinaStatusa = '#e6f2ff';
            let tekstStatusa = kvar.status || kvar.Status; 
            
            if (jeZavrseno) {
              bojaTrake = 'green';
              bojaTekstaStatusa = 'green';
              pozadinaStatusa = '#e6f4ea';
            } else if (statusLower === 'zakazano') {
              const trenutnoVreme = new Date().getTime();
              const datumZakazivanja = kvar.datumZakazivanja || kvar.DatumZakazivanja;
              const jePrekoracen = datumZakazivanja && new Date(datumZakazivanja).getTime() < trenutnoVreme;
              
              if (jePrekoracen) {
                bojaTrake = '#dc3545'; 
                bojaTekstaStatusa = '#dc3545';
                pozadinaStatusa = '#fce8e6';
                tekstStatusa = 'Prekoračeno'; 
              } else {
                bojaTrake = '#fd7e14'; 
                bojaTekstaStatusa = '#fd7e14';
                pozadinaStatusa = '#fff3cd';
              }
            }
            
            return (
              <li 
                key={kvar.id || kvar.Id}
                onClick={() => navigate('/portir/kvarovi')} 
                style={{
                  backgroundColor: 'white', padding: '20px', borderRadius: '8px',
                  borderLeft: `5px solid ${bojaTrake}`, boxShadow: '0 2px 5px rgba(0,0,0,0.03)', 
                  display: 'flex', flexDirection: 'column', gap: '5px', boxSizing: 'border-box', 
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                  <span style={{ fontWeight: 'bold', color: bojaTekstaStatusa, backgroundColor: pozadinaStatusa, padding: '4px 10px', borderRadius: '4px', fontSize: '12px', textTransform: 'uppercase' }}>
                    {tekstStatusa}
                  </span>
                  <span style={{ fontSize: '13px', color: '#888' }}>
                    {formatirajDatum(jeZavrseno ? (kvar.datumPopravke || kvar.DatumPopravke) : (kvar.vremeZakazivanja || kvar.VremeZakazivanja || kvar.datumZakazivanja || kvar.DatumZakazivanja))}
                  </span>
                </div>

                <p style={{ margin: '8px 0 0 0', fontSize: '15px', color: '#333', lineHeight: '1.4' }}>
                  {jeZavrseno ? (
                    <>Prijava kvara za <strong>{ocistiVrstuKvara(kvar.vrstaKvara || kvar.VrstaKvara)}</strong> u sobi <strong>{kvar.lokacija || kvar.Lokacija}</strong> koju ste uneli je uspešno rešena.</>
                  ) : (
                    <>
                      {brojIzmenaKljuč > 1 ? (
                        <>
                          Majstor je <strong>izmenio</strong> termin dolaska za kvar <strong>{ocistiVrstuKvara(kvar.vrstaKvara || kvar.VrstaKvara)}</strong> u sobi <strong>{kvar.lokacija || kvar.Lokacija}</strong>. <br />
                          Novi termin je: <strong style={{ color: '#fd7e14' }}>{formatirajDatum(kvar.vremeZakazivanja || kvar.VremeZakazivanja || kvar.datumZakazivanja || kvar.DatumZakazivanja)}</strong>.
                        </>
                      ) : (
                        <>
                          Majstor je <strong>definisao</strong> termin dolaska za prijavu kvara <strong>{ocistiVrstuKvara(kvar.vrstaKvara || kvar.VrstaKvara)}</strong> u sobi <strong>{kvar.lokacija || kvar.Lokacija}</strong>. <br />
                          Majstor dolazi: <strong style={{ color: '#fd7e14' }}>{formatirajDatum(kvar.vremeZakazivanja || kvar.VremeZakazivanja || kvar.datumZakazivanja || kvar.DatumZakazivanja)}</strong>.
                        </>
                      )}
                    </>
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PortirObavestenja;
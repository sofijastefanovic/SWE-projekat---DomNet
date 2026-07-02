import React, { useState, useEffect } from 'react';
import PortirMeni from './PortirMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const PortirIzvestaji = () => {
  const [izvestaji, setIzvestaji] = useState([]);
  const [tekst, setTekst] = useState('');
  const [smena, setSmena] = useState('Prva'); 
  const [loading, setLoading] = useState(true);
  const [poruka, setPoruka] = useState({ tekst: '', tip: '' });
  const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);
  
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [trenutniKorisnikIme, setTrenutniKorisnikIme] = useState('');
  const [trenutniKorisnikId, setTrenutniKorisnikId] = useState(null);
  
  const [prikaziTipInfo, setPrikaziTipInfo] = useState(false);

  useEffect(() => {
    const handleResize = () => setSirinaEkrana(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
    if (sacuvaniKorisnik) {
      const portir = JSON.parse(sacuvaniKorisnik);
      if (portir) {
        const id = portir.id || portir.Id || null;
        setTrenutniKorisnikId(id);

        const ime = portir.Ime || portir.ime || portir.KorisnickoIme || portir.korisnickoIme || '';
        const prezime = portir.Prezime || portir.prezime || '';
        setTrenutniKorisnikIme(`${ime} ${prezime}`.trim() || 'Portir');
      }
    }
  }, []);

  const formatirajDatum = (datumString) => {
    if (!datumString) return '';
    const d = new Date(datumString);
    return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
  };

  const fetchIzvestaji = async () => {
    try {
      const res = await fetch(`${konfiguracija.baseURL}/api/izvestaj`);
      if (res.ok) {
        const podaci = await res.json();
        const sortirani = podaci.sort((a, b) => {
          const datumA = new Date(a.datum || a.Datum);
          const datumB = new Date(b.datum || b.Datum);
          return datumB - datumA;
        });
        setIzvestaji(sortirani);
      } else {
        setPoruka({ tekst: 'Greska pri ucitavanju istorije izvestaja.', tip: 'error' });
      }
    } catch (err) {
      console.error("Greska pri ucitavanju izvestaja:", err);
      setPoruka({ tekst: 'Nije moguce povezivanje sa serverom.', tip: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIzvestaji();
  }, []);

  const handlePrijaviIzvestaj = async (e) => {
    e.preventDefault();
    if (!tekst.trim()) return;

    const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
    let portirId = 1; 

    if (sacuvaniKorisnik) {
      const portir = JSON.parse(sacuvaniKorisnik);
      if (portir && (portir.id || portir.Id)) {
        portirId = portir.id || portir.Id;
      }
    }

    const noviIzvestaj = {
      Naziv: `Izveštaj - ${smena} smena`,
      Tekst: tekst,
      Tip: smena, 
      AutorId: portirId, 
      Datum: new Date().toISOString()
    };

    try {
      const res = await fetch(`${konfiguracija.baseURL}/api/izvestaj`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noviIzvestaj)
      });

      if (res.ok) {
        setTekst(''); 
        setPrikaziFormu(false); 
        setPoruka({ tekst: 'Izveštaj je uspešno sačuvan i poslat upravniku!', tip: 'success' });
        fetchIzvestaji(); 
        
        setTimeout(() => setPoruka({ tekst: '', tip: '' }), 3000);
      } else {
        const errText = await res.text();
        setPoruka({ tekst: `Greska na serveru: ${errText || res.statusText}`, tip: 'error' });
      }
    } catch (err) {
      console.error(err);
      setPoruka({ tekst: 'Greska u komunikaciji sa serverom.', tip: 'error' });
    }
  };

  const izvuciImeAutora = (izv) => {
    const izvestajAutorId = izv.autorId || izv.AutorId;

    if (trenutniKorisnikId && izvestajAutorId === trenutniKorisnikId) {
      return trenutniKorisnikIme || 'Portir';
    }

    return 'Portir';
  };

  const jeTelefon = sirinaEkrana <= 600;

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      padding: jeTelefon ? '20px 12px' : '30px', 
      backgroundColor: '#f9f9f9', 
      boxSizing: 'border-box', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <PortirMeni />
      
      <div style={{ width: '100%', boxSizing: 'border-box' }}>
        {poruka.tekst && (
          <div style={{ 
            padding: '12px 15px', 
            borderRadius: '6px', 
            marginBottom: '20px', 
            fontWeight: 'bold',
            fontSize: '14px',
            backgroundColor: poruka.tip === 'success' ? '#e6f4ea' : '#fce8e6', 
            color: poruka.tip === 'success' ? 'green' : '#dc3545',
            border: `1px solid ${poruka.tip === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {poruka.tekst}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '25px' }}>
          <button
            onClick={() => setPrikaziFormu(!prikaziFormu)}
            style={{
              padding: '12px 28px',
              backgroundColor: prikaziFormu ? '#dc3545' : '#007bff', 
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '15px',
              transition: 'background-color 0.2s, transform 0.1s',
              boxShadow: '0 4px 6px rgba(0,123,255,0.15)',
              outline: 'none'
            }}
          >
            {prikaziFormu ? 'Zatvori' : 'Kreiraj dnevni izveštaj'}
          </button>
        </div>

        {prikaziFormu && (
          <form onSubmit={handlePrijaviIzvestaj} style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)', 
            marginBottom: '40px',
            border: '1px solid #eee'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: 'clamp(15px, 1.4vw, 18px)', color: '#333', fontWeight: 'bold' }}>
              Napiši novi izveštaj {trenutniKorisnikIme && <span style={{ fontWeight: 'normal', color: '#777', fontSize: '14px' }}>(Sastavlja: {trenutniKorisnikIme})</span>}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: 'clamp(13px, 1.2vw, 14.5px)', fontWeight: 'bold', color: '#555' }}>
                Izaberi smenu:
              </label>
              <select 
                value={smena} 
                onChange={(e) => setSmena(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 15px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc', 
                  backgroundColor: '#fff', 
                  fontSize: 'clamp(12.5px, 1.1vw, 14px)', 
                  height: '40px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Prva">Prva smena (07:00h - 19:00h)</option>
                <option value="Druga">Druga smena (19:00h - 07:00h)</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: 'clamp(13px, 1.2vw, 14.5px)', fontWeight: 'bold', color: '#555' }}>
                Tekst izveštaja:
              </label>
              <textarea 
                placeholder="Upišite stanje, predaju ključeva, posete ili vanredne događaje..." 
                value={tekst} 
                onChange={e => setTekst(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  height: '140px', 
                  padding: '12px 15px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc', 
                  fontSize: 'clamp(12.5px, 1.1vw, 14px)', 
                  resize: 'vertical', 
                  boxSizing: 'border-box', 
                  outline: 'none',
                  fontFamily: 'Arial, sans-serif'
                }} 
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
              <button type="submit" style={{ 
                padding: '12px 25px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                fontSize: '15px', 
                transition: 'background-color 0.2s',
                height: '42px'
              }}>
                Sačuvaj izveštaj
              </button>

              <div 
                  onMouseEnter={() => setPrikaziTipInfo(true)}
                  onMouseLeave={() => setPrikaziTipInfo(false)}
                  onClick={() => setPrikaziTipInfo(!prikaziTipInfo)}
                  style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      userSelect: 'none',
                      position: 'relative',
                      flexShrink: 0
                  }}
              >
                  ?

                  {prikaziTipInfo && (
                      <div style={{
                          position: 'absolute',
                          top: '34px',
                          left: jeTelefon ? '-100px' : '0px',
                          width: jeTelefon ? '220px' : '260px',
                          backgroundColor: '#333',
                          color: 'white',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          lineHeight: '1.4',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                          zIndex: 1500,
                          fontWeight: 'normal',
                          textAlign: 'left'
                      }}>
                          Klikom na dugme sačuvaj izveštaj, izveštaj se automatski šalje upravniku.
                          
                          <div style={{
                              position: 'absolute',
                              top: '-5px',
                              left: jeTelefon ? '106px' : '6px',
                              width: '0',
                              height: '0',
                              borderLeft: '6px solid transparent',
                              borderRight: '6px solid transparent',
                              borderBottom: '6px solid #333'
                          }} />
                      </div>
                  )}
              </div>
            </div>

          </form>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0 35px 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', position: 'relative' }}>
          <h2 style={{ color: '#333', margin: 0, textAlign: 'left' }}>
            Prethodni izveštaji portirnice
          </h2>
        </div>
        
        {loading ? (
          <p style={{ color: '#777', fontStyle: 'italic', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Učitavanje istorije izveštaja...</p>
        ) : izvestaji.length === 0 ? (
          <p style={{ color: '#777', fontStyle: 'italic', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Nema upisanih izveštaja u istoriji.</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: sirinaEkrana > 1200 ? 'repeat(3, 1fr)' : sirinaEkrana > 768 ? 'repeat(2, 1fr)' : '1fr', 
            gap: '20px',
            width: '100%',
            boxSizing: 'border-box',
            marginBottom: '30px'
          }}>
            {izvestaji.map((izv) => {
              const trenId = izv.id || izv.Id;
              const trenSmena = izv.tip || izv.Tip || izv.smena || izv.Smena; 
              const trenDatum = izv.datum || izv.Datum;
              const trenTekst = izv.tekst || izv.Tekst;

              return (
                <div key={trenId} style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)', 
                  border: '1px solid #eee',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px dashed #eee', paddingBottom: '10px', flexWrap: 'wrap', gap: '5px' }}>
                      <span style={{ fontWeight: 'bold', color: '#007bff', backgroundColor: '#e7f3ff', padding: '4px 10px', borderRadius: '4px', fontSize: 'clamp(11px, 1vw, 12px)', textTransform: 'uppercase' }}>
                        {trenSmena} smena
                      </span>
                      <small style={{ color: '#888', fontWeight: 'bold', fontSize: 'clamp(11px, 1vw, 12.5px)' }}>{formatirajDatum(trenDatum)}</small>
                    </div>
                    <p style={{ margin: '0 0 15px 0', color: '#333', fontSize: 'clamp(12.5px, 1.1vw, 14px)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      {trenTekst}
                    </p>
                  </div>
                  <div style={{ 
                    borderTop: '1px solid #f5f5f5', 
                    paddingTop: '10px', 
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#666', 
                      fontStyle: 'italic' 
                    }}>
                      Sastavio/la: <strong style={{ color: '#333', fontStyle: 'normal' }}>{izvuciImeAutora(izv)}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortirIzvestaji;
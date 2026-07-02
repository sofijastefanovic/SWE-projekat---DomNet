import React, { useState, useEffect } from 'react';
import UpravnikMeni from './UpravnikMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const UpravnikIzvestaji = () => {
  const [izvestaji, setIzvestaji] = useState([]);
  const [filtriraniIzvestaji, setFiltriraniIzvestaji] = useState([]);
  const [imenaPortira, setImenaPortira] = useState({}); 
  const [izabranaSmena, setIzabranaSmena] = useState('Sve'); 
  const [izabraniDatum, setIzabraniDatum] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setSirinaEkrana(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatirajDatum = (datumString) => {
    if (!datumString) return 'Nije definisano';
    const d = new Date(datumString);
    return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
  };

  useEffect(() => {
    const ucitajIzvestaje = async () => {
      try {
        const resIzvestaji = await fetch(`${konfiguracija.baseURL}/api/Izvestaj`);
        if (resIzvestaji.ok) {
          const sviIzvestaji = await resIzvestaji.json();
          const sortirani = sviIzvestaji.sort((a, b) => {
            const datumA = a.datum || a.Datum;
            const datumB = b.datum || b.Datum;
            return new Date(datumB).getTime() - new Date(datumA).getTime();
          });
          setIzvestaji(sortirani);
          
          setFiltriraniIzvestaji(sortirani); 

          sviIzvestaji.forEach(izv => {
            const autorId = izv.autorId || izv.AutorId;
            if (autorId !== undefined && autorId !== null) {
              ucitajImePortira(autorId);
            }
          });
        }
      } catch (err) {
        console.error("Greška pri učitavanju izveštaja:", err);
      } finally {
        setLoading(false);
      }
    };
    
    ucitajIzvestaje(); 
    
    const interval = setInterval(() => {
        ucitajIzvestaje(); 
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const ucitajImePortira = async (id) => {
    if (imenaPortira[id]) return;

    try {
      const res = await fetch(`${konfiguracija.baseURL}/api/Profil/portir/${id}`);
      if (res.ok) {
        const podaci = await res.json();
        if (podaci && podaci.ime) {
          setImenaPortira(prethodna => ({
            ...prethodna,
            [id]: podaci.ime.trim()
          }));
        }
      }
    } catch (err) {
      console.error(`Neuspešno povlačenje profila za portira sa ID: ${id}`, err);
    }
  };

  const odrediSmenu = (izv) => {
    const tip = izv.tip || izv.Tip || "";
    const cistTip = tip.toLowerCase().trim();

    if (cistTip === "prva" || cistTip === "prva smena") {
      return "Prva smena";
    }
    if (cistTip === "druga" || cistTip === "druga smena") {
      return "Druga smena";
    }
    
    const tekst = (izv.tekst || izv.Tekst || "").toLowerCase();
    if (tekst.includes("15:00h") || tekst.includes("21:30h")) {
      return "Druga smena";
    }
    
    return "Prva smena";
  };

  const formatirajImeSastavljaca = (autorId) => {
    const imeIzBaze = imenaPortira[autorId];
    if (!imeIzBaze) return "Portir";

    if (imeIzBaze.toLowerCase().includes("portir")) {
      return imeIzBaze;
    }
    return `${imeIzBaze} Portir`;
  };

  useEffect(() => {
    let filtrirani = izvestaji;

    if (izabranaSmena !== 'Sve') {
      filtrirani = filtrirani.filter(izv => {
        const detektovanaSmena = odrediSmenu(izv).toLowerCase();
        const trazenaSmena = izabranaSmena.toLowerCase();
        return detektovanaSmena.includes(trazenaSmena);
      });
    }

    if (izabraniDatum) {
      filtrirani = filtrirani.filter(izv => {
        const datumIzvestaja = izv.datum || izv.Datum;
        if (!datumIzvestaja) return false;
        
        const cistiDatum = datumIzvestaja.split('T')[0];
        return cistiDatum === izabraniDatum;
      });
    }

    setFiltriraniIzvestaji(filtrirani);
  }, [izabranaSmena, izabraniDatum, izvestaji]);

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      margin: 0, 
      padding: sirinaEkrana <= 600 ? '20px 12px' : '30px', 
      backgroundColor: '#f9f9f9', 
      boxSizing: 'border-box', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <UpravnikMeni />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '20px', 
        backgroundColor: 'white', 
        padding: '15px 20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)', 
        marginBottom: '25px',
        border: '1px solid #eee',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Filter po smeni  */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'clamp(13px, 1.2vw, 14.5px)', fontWeight: 'bold', color: '#555' }}>Filtriraj po smeni:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Sve', 'Prva', 'Druga'].map((smena) => (
              <button
                key={smena}
                onClick={() => setIzabranaSmena(smena)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: 'clamp(12px, 1.1vw, 13.5px)',
                  fontWeight: 'bold',
                  backgroundColor: izabranaSmena === smena ? '#007bff' : '#fff',
                  color: izabranaSmena === smena ? '#fff' : '#555',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                  height: '36px'
                }}
              >
                {smena === 'Sve' ? 'Sve smene' : `${smena} smena`}
              </button>
            ))}
          </div>
        </div>

        {/* Filter po datumu  */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'clamp(13px, 1.2vw, 14.5px)', fontWeight: 'bold', color: '#555' }}>Pretraži po datumu:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="date" 
              value={izabraniDatum} 
              onChange={(e) => setIzabraniDatum(e.target.value)}
              style={{
                padding: '0 12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: 'clamp(12px, 1.1vw, 13.5px)',
                outline: 'none',
                height: '36px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                fontFamily: 'Arial, sans-serif'
              }}
            />
            
            {izabraniDatum && (
              <button
                onClick={() => setIzabraniDatum('')}
                style={{
                  padding: '0 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 'clamp(12px, 1.1vw, 13.5px)',
                  height: '36px',
                  transition: 'background-color 0.15s ease'
                }}
              >
                Poništi datum
              </button>
            )}
          </div>
        </div>

      </div>

      {loading ? (
        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Učitavanje izveštaja...</p>
      ) : filtriraniIzvestaji.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '40px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #eee', fontSize: 'clamp(13px, 1.2vw, 14.5px)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          Nema pronađenih izveštaja za izabrane filtere.
        </p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: sirinaEkrana > 1200 ? 'repeat(2, 1fr)' : '1fr', 
          gap: '20px',
          width: '100%',
          boxSizing: 'border-box',
          marginBottom: '30px'
        }}>
          {filtriraniIzvestaji.map((izv) => {
            const trenutniTekst = izv.tekst || izv.Tekst;
            const trenutniDatum = izv.datum || izv.Datum;
            const autorId = izv.autorId || izv.AutorId;
            
            const prikazSmene = odrediSmenu(izv);
            const imeSastavljača = formatirajImeSastavljaca(autorId);

            return (
              <div 
                key={izv.id || izv.Id} 
                style={{ 
                  backgroundColor: 'white', 
                  padding: '25px', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)', 
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  minHeight: '220px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: '#007bff', 
                      backgroundColor: '#e7f3ff', 
                      padding: '8px 16px', 
                      borderRadius: '6px', 
                      fontSize: '13px', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {prikazSmene}
                    </span>
                    <small style={{ color: '#777', fontWeight: '500', fontSize: '13px' }}>
                      {formatirajDatum(trenutniDatum)}
                    </small>
                  </div>

                  <p style={{ margin: '0 0 20px 0', color: '#333', fontSize: '14.5px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {trenutniTekst}
                  </p>
                </div>

                <div style={{ 
                  borderTop: '1px solid #f5f5f5', 
                  paddingTop: '15px',
                  marginTop: 'auto'
                }}>
                  <span style={{ fontSize: '13.5px', color: '#666', fontStyle: 'italic' }}>
                    Sastavio/la: <strong style={{ color: '#111', fontStyle: 'normal', fontWeight: 'bold' }}>{imeSastavljača}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpravnikIzvestaji;
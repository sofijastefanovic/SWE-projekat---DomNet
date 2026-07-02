import React, { useState, useEffect } from 'react';
import konfiguracija from '../konfiguracija.js';

const ZakaziKvarModal = ({ kvar, onClose, onUspeh, setPoruka }) => {
 
  const danasnjiDatum = new Date().toISOString().split('T')[0];
  const [datum, setDatum] = useState(danasnjiDatum); 
  const [sat, setSat] = useState('09'); 
  const [minut, setMinut] = useState('00');
  const [zauzetiTermini, setZauzetiTermini] = useState([]); 
  const [lokalnaGreska, setLokalnaGreska] = useState('');
  const [prikaziPreklapanjeUpozorenje, setPrikaziPreklapanjeUpozorenje] = useState(false);
  const [prikaziInfo, setPrikaziInfo] = useState(false); 
  const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

  const satiOpcije = Array.from({ length: 10 }, (_, i) => (i + 8).toString().padStart(2, '0'));
  const minutiOpcije = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  useEffect(() => {
    const handleResize = () => setSirinaEkrana(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const proveriZauzeteTermine = async () => {
      if (!datum) return;
      try {
        const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/zakazani`);
        if (response.ok) {
          const podaci = await response.json();
          
          const zaTajDan = podaci.filter(k => {
            if (!(k.status || k.Status) || (k.status || k.Status).toLowerCase() !== 'zakazano') return false;
            const proveraDatuma = k.datumZakazivanja || k.DatumZakazivanja;
            return proveraDatuma && proveraDatuma.startsWith(datum);
          });

          const sortiraniTermini = zaTajDan.sort((a, b) => new Date(a.datumZakazivanja || a.DatumZakazivanja) - new Date(b.datumZakazivanja || b.DatumZakazivanja));
          setZauzetiTermini(sortiraniTermini);
        }
      } catch (error) {
        console.error('Greška pri proveravanju zauzetih termina:', error);
      }
    };

    proveriZauzeteTermine();
  }, [datum]);

  if (!kvar) return null;

  const posaljiZahtevNaServer = async (kombinovanoVreme) => {
    try {
      const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/zakazi/${kvar.id || kvar.Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kombinovanoVreme)
      });
      
      if (response.ok) {
        setPoruka('Popravka je uspešno zakazana!');
        if (onUspeh) onUspeh(); 
        onClose(); 
      } else {
        setLokalnaGreska('Došlo je do greške na serveru prilikom zakazivanja.');
      }
    } catch (error) {
      console.error('Greška:', error);
      setLokalnaGreska('Nije moguće uspostaviti vezu sa serverom.');
    }
  };

  const handlePotvrdi = async () => {
    setLokalnaGreska(''); 
    setPrikaziPreklapanjeUpozorenje(false);

    if (!datum || !sat || !minut) {
      setLokalnaGreska('Molimo vas da izaberete sve podatke za zakazivanje!');
      return;
    }

    const trenutnoVreme = new Date();
    const izabraniTermin = new Date(`${datum}T${sat}:${minut}:00`);

    if (izabraniTermin < trenutnoVreme) {
      setLokalnaGreska('Greška: Ne možete zakazati termin u prošlosti!');
      return;
    }

    const kombinovanoVreme = `${datum}T${sat}:${minut}:00`;

    const terminVecZauzet = zauzetiTermini.some(t => {
      const d = new Date(t.datumZakazivanja || t.DatumZakazivanja);
      const proveraSata = d.getHours().toString().padStart(2, '0');
      const proveraMinuta = d.getMinutes().toString().padStart(2, '0');
      return proveraSata === sat && proveraMinuta === minut;
    });

    if (terminVecZauzet) {
      setPrikaziPreklapanjeUpozorenje(true);
      return;
    }

    await posaljiZahtevNaServer(kombinovanoVreme);
  };

  const jeMaliEkran = sirinaEkrana <= 600;

  return (
    <div 
      onClick={onClose} 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1300, padding: '20px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{
          backgroundColor: 'white', padding: '35px 25px 25px 25px', borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px',
          position: 'relative', textAlign: 'center', fontFamily: 'Arial, sans-serif',
          boxSizing: 'border-box'
        }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#333', fontWeight: 'bold' }}
        >
          X
        </button>
        
        <h3 style={{ color: '#007bff', marginTop: 0, marginBottom: '8px' }}>Izaberi vreme popravke</h3>
        <p style={{ fontSize: '13.5px', color: '#666', marginBottom: '20px' }}>
          Kvar: <strong>{kvar.vrstaKvara ? kvar.vrstaKvara.split('(')[0].trim() : (kvar.VrstaKvara ? kvar.VrstaKvara.split('(')[0].trim() : '')}</strong> u sobi <strong>{kvar.lokacija || kvar.Lokacija}</strong>
        </p>

        {lokalnaGreska && (
          <div style={{ backgroundColor: '#fff0f3', color: '#d81b60', border: '1px solid #ffccd5', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
            {lokalnaGreska}
          </div>
        )}

        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Izaberite dan:</label>
          <input 
            type="date" 
            value={datum}
            min={danasnjiDatum} 
            onChange={(e) => { setDatum(e.target.value); setPrikaziPreklapanjeUpozorenje(false); }}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', fontSize: '15px', boxSizing: 'border-box', cursor: 'pointer', fontFamily: 'Arial, sans-serif' }}
          />
        </div>

        <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', marginBottom: '15px', textAlign: 'left', boxSizing: 'border-box' }}>
          <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>
            Raspored za ovaj dan ({zauzetiTermini.length}):
          </span>
          {zauzetiTermini.length === 0 ? (
            <span style={{ fontSize: '13px', color: 'green', fontStyle: 'italic' }}>Nema zakazanih popravki, ceo dan je slobodan!</span>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '65px', overflowY: 'auto', paddingRight: '2px' }}>
              {zauzetiTermini.map(t => {
                const vreme = new Date(t.datumZakazivanja || t.DatumZakazivanja);
                const satnica = vreme.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
                return (
                  <span key={t.id || t.Id} style={{ backgroundColor: '#e6f2ff', color: '#007bff', fontSize: '12px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', border: '1px solid #b3d7ff' }} title={`Soba ${t.lokacija || t.Lokacija}`}>
                    {satnica}h (Soba {t.lokacija || t.Lokacija})
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '22px', textAlign: 'left' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Sat:</label>
            <select
              value={sat}
              onChange={(e) => { setSat(e.target.value); setPrikaziPreklapanjeUpozorenje(false); }}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: 'white', cursor: 'pointer', height: '45px', color: '#333', fontWeight: 'bold' }}
            >
              {satiOpcije.map(s => (
                <option key={s} value={s}>{s} h</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Minut:</label>
            <select
              value={minut}
              onChange={(e) => { setMinut(e.target.value); setPrikaziPreklapanjeUpozorenje(false); }}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: 'white', cursor: 'pointer', height: '45px', color: '#333', fontWeight: 'bold' }}
            >
              {minutiOpcije.map(m => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
          </div>
        </div>

        {prikaziPreklapanjeUpozorenje ? (
          <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeeba', padding: '15px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', boxSizing: 'border-box' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: '#856404', fontWeight: 'bold', lineHeight: '1.4' }}>
              Pažnja: Termin u {sat}:{minut}h je već zauzet. <br />
              Da li ste sigurni da želite da preklopite termine?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => posaljiZahtevNaServer(`${datum}T${sat}:${minut}:00`)}
                style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                Da, preklopi
              </button>
              <button 
                onClick={() => setPrikaziPreklapanjeUpozorenje(false)}
                style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                Odustani
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', boxSizing: 'border-box', position: 'relative' }}>
            <button 
              onClick={handlePotvrdi}
              style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1, fontWeight: 'bold', fontSize: '15px', boxShadow: '0 4px 10px rgba(40,167,69,0.15)' }}
            >
              Potvrdi unos
            </button>

            <div 
              onMouseEnter={() => setPrikaziInfo(true)}
              onMouseLeave={() => setPrikaziInfo(false)}
              onClick={() => setPrikaziInfo(!prikaziInfo)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#6c757d',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                flexShrink: 0
              }}
            >
              ?

              {prikaziInfo && (
                <div style={{
                  position: 'absolute',
                  top: jeMaliEkran ? '34px' : 'auto',
                  bottom: jeMaliEkran ? 'auto' : '36px', 
                  right: '-5px',
                  width: '240px',
                  backgroundColor: '#333',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  lineHeight: '1.4',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1500,
                  fontWeight: 'normal',
                  textAlign: 'left'
                }}>
                  Potvrdom ovog termina, sistem će <strong>automatski poslati obaveštenje</strong> korisniku koji je prijavio kvar sa tačnim datumom i vremenom zakazanog termina popravke.
                  
                  <div style={{
                    position: 'absolute',
                    top: jeMaliEkran ? '-5px' : 'auto',
                    bottom: jeMaliEkran ? 'auto' : '-5px',
                    right: '12px',
                    width: '0',
                    height: '0',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: jeMaliEkran ? 'none' : '6px solid #333',
                    borderBottom: jeMaliEkran ? '6px solid #333' : 'none'
                  }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZakaziKvarModal;
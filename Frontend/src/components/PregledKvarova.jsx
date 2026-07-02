import React, { useState, useEffect } from 'react';
import konfiguracija from '../konfiguracija.js';


const PregledKvarova = () => {
  const [noviKvarovi, setNoviKvarovi] = useState([]);
  const [zakazaniKvarovi, setZakazaniKvarovi] = useState([]);
  const [izabraniDatumi, setIzabraniDatumi] = useState({});
  const [poruka, setPoruka] = useState('');
  const [trenutniDatum, setTrenutniDatum] = useState(new Date());
  const [selektovaniDanZaPrikaz, setSelektovaniDanZaPrikaz] = useState(null);

 
  const fetchSveKvarove = async () => {
    try {
        const resNovi = await fetch(`${konfiguracija.baseURL}/api/kvarovi/novi`);
      if (resNovi.ok) setNoviKvarovi(await resNovi.json());

        const resZakazani = await fetch(`${konfiguracija.baseURL}/api/kvarovi/zakazani`);
      if (resZakazani.ok) setZakazaniKvarovi(await resZakazani.json());
    } catch (error) {
      console.error('Greška pri učitavanju:', error);
      setPoruka('Nije moguće uspostaviti vezu sa serverom.');
    }
  };

  
  useEffect(() => {
    fetchSveKvarove();
  }, []);

  
  const zakaziKvar = async (id) => {
    const datum = izabraniDatumi[id];
    if (!datum) {
      alert('Molimo vas da izaberete datum i vreme!');
      return;
    }
    try {
        const response = await fetch(`${ konfiguracija.baseURL } /api/kvarovi/zakazi/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datum)
      });
      if (response.ok) {
        setPoruka('Kvar je uspešno zakazan!');
        fetchSveKvarove();
      }
    } catch (error) {
      console.error('Greška:', error);
    }
  };

 
  const zavrsiPopravku = async (id) => {
    try {
        const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/azuriraj-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify('završeno')
      });
      if (response.ok) {
        setPoruka('Popravka je uspešno završena!');
        setSelektovaniDanZaPrikaz(null);
        fetchSveKvarove();
      }
    } catch (error) {
      console.error('Greška:', error);
    }
  };

  const godina = trenutniDatum.getFullYear();
  const mesec = trenutniDatum.getMonth();
  const imeMeseca = trenutniDatum.toLocaleString('sr-RS', { month: 'long' });
  const brojDanaUMesecu = new Date(godina, mesec + 1, 0).getDate();
  const prviDanUMesecu = new Date(godina, mesec, 1).getDay();
  const praznaPoljaNaPocetku = prviDanUMesecu === 0 ? 6 : prviDanUMesecu - 1;

  const dani = [];
  for (let i = 0; i < praznaPoljaNaPocetku; i++) {
    dani.push(null);
  }
  for (let i = 1; i <= brojDanaUMesecu; i++) {
    dani.push(i);
  }

  
  const getKvaroviZaDan = (dan) => {
    if (!dan) return [];
    return zakazaniKvarovi.filter(kvar => {
      if (!kvar.datumZakazivanja) return false;
      const d = new Date(kvar.datumZakazivanja);
      return d.getDate() === dan && d.getMonth() === mesec && d.getFullYear() === godina;
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', color: '#333', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      
      {poruka && <p style={{ color: 'blue', fontWeight: 'bold', backgroundColor: '#e6f2ff', padding: '10px', borderRadius: '5px' }}>{poruka}</p>}

      <h2>Novi kvarovi (Na čekanju)</h2>
      {noviKvarovi.length === 0 ? (
        <p style={{ color: 'green' }}>Trenutno nema novih prijavljenih kvarova.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {noviKvarovi.map((kvar) => (
            <li key={kvar.id} style={{ border: '2px solid #ccc', margin: '15px 0', padding: '15px', borderRadius: '8px', backgroundColor: 'white' }}>
              <p><strong>Vrsta kvara:</strong> {kvar.vrstaKvara}</p>
              <p><strong>Lokacija:</strong> Soba {kvar.lokacija}</p>
              <p><strong>Opis:</strong> {kvar.opis || 'Nema opisa'}</p>
              
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Izaberi vreme popravke:</label>
                <input 
                  type="datetime-local" 
                  value={izabraniDatumi[kvar.id] || ''} 
                  onChange={(e) => setIzabraniDatumi({ ...izabraniDatumi, [kvar.id]: e.target.value })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '95%' }}
                />
              </div>

              <button
                onClick={() => zakaziKvar(kvar.id)}
                style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginTop: '12px', borderRadius: '4px', width: '100%', fontWeight: 'bold' }}
              >
                Potvrdi i zakaži dolazak
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: '30px 0', border: '1px solid #ddd' }} />

      <h2>Moje zakazane popravke</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={() => setTrenutniDatum(new Date(godina, mesec - 1, 1))} style={{ padding: '5px 10px', cursor: 'pointer' }}>◀</button>
        <h3 style={{ textTransform: 'capitalize' }}>{imeMeseca} {godina}.</h3>
        <button onClick={() => setTrenutniDatum(new Date(godina, mesec + 1, 1))} style={{ padding: '5px 10px', cursor: 'pointer' }}>▶</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', fontWeight: 'bold', marginBottom: '5px', textAlign: 'center', fontSize: '12px' }}>
        <div>PON</div><div>UTO</div><div>SRE</div><div>ČET</div><div>PET</div><div>SUB</div><div>NED</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
        {dani.map((dan, index) => {
          const kvaroviZaOvajDan = getKvaroviZaDan(dan);
          const imaKvar = kvaroviZaOvajDan.length > 0;

          return (
            <div 
              key={index} 
              onClick={() => dan && imaKvar && setSelektovaniDanZaPrikaz(dan)}
              style={{
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: dan ? (imaKvar ? '#ffccd5' : '#fff') : 'transparent',
                border: dan ? '1px solid #ddd' : 'none',
                borderRadius: '4px',
                cursor: dan && imaKvar ? 'pointer' : 'default',
                fontWeight: imaKvar ? 'bold' : 'normal',
                color: imaKvar ? '#800f2f' : '#333',
                position: 'relative'
              }}
            >
              {dan}
              {imaKvar && (
                <span style={{ position: 'absolute', bottom: '2px', right: '4px', fontSize: '10px', backgroundColor: '#fff', padding: '0 4px', borderRadius: '5px', border: '1px solid #ffb3c1' }}>
                  {kvaroviZaOvajDan.length}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selektovaniDanZaPrikaz && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff0f3', border: '2px solid #ffccd5', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: '#800f2f', margin: 0 }}>Popravke za {selektovaniDanZaPrikaz}. {imeMeseca}:</h4>
            <button onClick={() => setSelektovaniDanZaPrikaz(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#007bff' }}>x</button>
          </div>
          
          {getKvaroviZaDan(selektovaniDanZaPrikaz).map(kvar => (
            <div key={kvar.id} style={{ borderBottom: '1px solid #ffccd5', paddingBottom: '10px', marginBottom: '10px', marginTop: '10px' }}>
              <p style={{ margin: '4px 0' }}><strong>Satnica:</strong> {new Date(kvar.datumZakazivanja).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}h</p>
              <p style={{ margin: '4px 0' }}><strong>Kvar:</strong> {kvar.vrstaKvara} (Soba {kvar.lokacija})</p>
              <p style={{ margin: '4px 0' }}><strong>Opis:</strong> {kvar.opis || 'Nema opisa'}</p>
              
              <button
                onClick={() => zavrsiPopravku(kvar.id)}
                style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '13px', marginTop: '4px' }}
              >
                Završi popravku
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PregledKvarova;
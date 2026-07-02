import React, { useState, useEffect } from 'react';
import StudentMeni from './StudentMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const PrijavaKvara = () => {
  const [vrstaKvara, setVrstaKvara] = useState('');
  const [lokacija, setLokacija] = useState('');
  const [opis, setOpis] = useState('');
  const [poruka, setPoruka] = useState('');
  const [istorijaPrijava, setIstorijaPrijava] = useState([]);
  const [otvorenProzor, setOtvorenProzor] = useState(false);
  const [prikaziInfo, setPrikaziInfo] = useState(false); 

  const formatirajDatum = (datumString) => {
    if (!datumString) return 'Nije evidentirano';
    const d = new Date(datumString);
    return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
  };

  const odrediBojuStatusa = (status, datumZakazivanja) => {
    if (!status) return '#007bff';
    const s = status.toLowerCase();
    if (s === 'završeno') return 'green';
    if (s === 'zakazano') {
      const trenchesVreme = new Date().getTime();
      const jePrekoracen = datumZakazivanja && new Date(datumZakazivanja).getTime() < trenchesVreme;
      return jePrekoracen ? '#dc3545' : '#fd7e14'; 
    }
    return '#007bff';
  };

  const fetchIstoriju = async () => {
    try {
        const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/sve`); 
      if (response.ok) {
        const podaci = await response.json();
        const sortirani = podaci.sort((a, b) => new Date(b.datumPrijave) - new Date(a.datumPrijave));
        setIstorijaPrijava(sortirani);
      }
    } catch (error) {
      console.error('Greška pri učitavanju istorije:', error);
    }
  };

  useEffect(() => {
    fetchIstoriju();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const noviKvar = {
      studentId: 1, 
      vrstaKvara: vrstaKvara,
      lokacija: lokacija,
      opis: opis,
      status: 'na čekanju'
    };

    try {
        const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/prijava`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noviKvar)
      });

      if (response.ok) {
        setPoruka('Kvar je uspešno prijavljen!');
        setVrstaKvara('');
        setLokacija('');
        setOpis('');
        setOtvorenProzor(false); 
        fetchIstoriju(); 
      } else {
        setPoruka('Došlo je do greške pri prijavi kvara.');
      }
    } catch (error) {
      console.error('Greška:', error);
      setPoruka('Nije moguće uspostaviti vezu sa serverom.');
    }
  };

  return (
    <div style={{ width: '95%', maxWidth: '1200px', margin: '30px auto', padding: '25px', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }}>
      
      <StudentMeni />

      {poruka && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p style={{ color: poruka.includes('uspešno') ? 'green' : 'red', backgroundColor: poruka.includes('uspešno') ? '#e6f4ea' : '#fce8e6', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', width: '100%', maxWidth: '550px', boxSizing: 'border-box' }}>
            {poruka}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <button 
          onClick={() => {
            setPoruka(''); 
            setOtvorenProzor(true);
          }} 
          style={{ padding: '14px 28px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,123,255,0.15)', transition: 'all 0.2s ease' }}
        >
          Prijavi novi kvar
        </button>
      </div>

      {otvorenProzor && (
        <div 
          onClick={() => setOtvorenProzor(false)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200, padding: '20px' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ backgroundColor: 'white', padding: '35px 30px 30px 30px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '500px', position: 'relative', textAlign: 'left', boxSizing: 'border-box' }}
          >
            <button 
              onClick={() => setOtvorenProzor(false)} 
              style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#333', fontWeight: 'bold' }}
            >
              X
            </button>

            <h2 style={{ color: '#007bff', marginTop: 0, marginBottom: '20px', textAlign: 'center', fontSize: '24px' }}>Prijava novog kvara</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Vrsta kvara: *</label>
                <select 
                  value={vrstaKvara} 
                  onChange={(e) => setVrstaKvara(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', height: '40px', fontSize: '14px', cursor: 'pointer' }}
                >
                  <option value="">-- Izaberi vrstu kvara --</option>
                  <option value="Vodovod">Vodovod (cevi, slavine...)</option>
                  <option value="Elektrika">Elektrika (svetla, utičnice...)</option>
                  <option value="Stolarija">Stolarija (vrata, prozori...)</option>
                  <option value="Grejanje">Grejanje</option>
                  <option value="Ostalo">Ostalo</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Lokacija (Broj sobe): *</label>
                <input 
                  type="text" 
                  value={lokacija} 
                  onChange={(e) => setLokacija(e.target.value)} 
                  placeholder="Npr. 413"
                  required 
                  style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Opis problema:</label>
                <textarea 
                  value={opis} 
                  onChange={(e) => setOpis(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Opišite detaljnije šta ne radi..."
                  rows="4"
                  style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'Arial', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', position: 'relative', width: '100%' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                  Pošalji prijavu majstoru
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
                  title="Klikni za pojašnjenje"
                >
                  ?

                  {prikaziInfo && (
                    <div style={{
                      position: 'absolute',
                      bottom: '36px', 
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
                      Nakon slanja, vaša prijava automatski dobija status <strong>"Na čekanju"</strong> i odmah je vidljiva majstoru. Čim majstor odredi termin, dobićete obaveštenje.
                      
                      <div style={{
                        position: 'absolute',
                        bottom: '-5px',
                        right: '12px',
                        width: '0',
                        height: '0',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid #333'
                      }} />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0 35px 0' }} />

      <h2 style={{ color: '#333', marginBottom: '20px', textAlign: 'left' }}>Istorija mojih prijava</h2>
      
      {istorijaPrijava.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>Nemate prethodnih prijava kvarova.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {istorijaPrijava.map((kvar) => (
            <li 
              key={kvar.id} 
              style={{ 
                backgroundColor: 'white', 
                borderLeft: `5px solid ${odrediBojuStatusa(kvar.status, kvar.datumZakazivanja)}`, 
                borderTop: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0',
                padding: '20px', borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
            >
              <div>
                <p style={{ margin: '0 0 12px 0', color: '#555', fontSize: '13.5px', fontWeight: '500' }}>
                  Prijavljeno: {formatirajDatum(kvar.datumPrijave)}
                </p>
                <p style={{ margin: '5px 0 12px 0' }}><strong>Kvar:</strong> {kvar.vrstaKvara?.split('(')[0].trim()}</p>
              </div>

              <div style={{ borderTop: '1px dashed #eee', paddingTop: '10px', fontSize: '14px' }}>
                <strong>Status:</strong>{' '}
                <span style={{ fontWeight: 'bold', color: odrediBojuStatusa(kvar.status, kvar.datumZakazivanja) }}>
                  {kvar.status}
                  {kvar.status?.toLowerCase() === 'zakazano' && kvar.datumZakazivanja && ` (za ${formatirajDatum(kvar.datumZakazivanja)})`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

export default PrijavaKvara;
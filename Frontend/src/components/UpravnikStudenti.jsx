import React, { useState, useEffect } from 'react';
import UpravnikMeni from './UpravnikMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const UpravnikStudenti = () => {
  const [sviStudenti, setSviStudenti] = useState([]);
  const [filtriraniStudenti, setFiltriraniStudenti] = useState([]);
  const [pretragaIme, setPretragaIme] = useState('');
  const [pretragaSoba, setPretragaSoba] = useState('');
  const [selektovaniStudent, setSelektovaniStudent] = useState(null);
  const [poruka, setPoruka] = useState('');
  const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

  
  useEffect(() => {
    const handleResize = () => setSirinaEkrana(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  useEffect(() => {
    const ucitajStudente = async () => {
      try {
        const response = await fetch(`${konfiguracija.baseURL}/api/studenti/sve`);
        if (response.ok) {
          const podaci = await response.json();
          const sortirani = podaci.sort((a, b) => (a.brSobe || 9999) - (b.brSobe || 9999));
          setSviStudenti(sortirani);
          setFiltriraniStudenti(sortirani);
        } else {
          setPoruka('Greška pri učitavanju studenata sa servera.');
        }
      } catch (error) {
        console.error(error);
        setPoruka('Nije moguće uspostaviti vezu sa serverom.');
      }
    };

    ucitajStudente();
  }, []);

 
  useEffect(() => {
    let privremeni = [...sviStudenti];

    if (pretragaIme.trim() !== '') {
      const upit = pretragaIme.trim().toLowerCase();
      privremeni = privremeni.filter(s => {
        const formatiranoIme = s.ime ? s.ime.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase() : '';
        const deloviImena = formatiranoIme.split(' ');
        return deloviImena.some(deo => deo.startsWith(upit));
      });
    }

    if (pretragaSoba.trim() !== '') {
      privremeni = privremeni.filter(s => 
        s.brSobe && s.brSobe.toString().startsWith(pretragaSoba.trim())
      );
    }

    setFiltriraniStudenti(privremeni);
  }, [pretragaIme, pretragaSoba, sviStudenti]);

  const formatirajDatum = (datumString) => {
    if (!datumString) return 'Nije evidentirano';
    const d = new Date(datumString);
    return d.toLocaleDateString('sr-RS');
  };

  const jeMaliEkran = sirinaEkrana <= 768;
  const jeTelefon = sirinaEkrana <= 600; 

  const stilRedaModal = {
    display: 'flex', 
    flexDirection: jeTelefon ? 'column' : 'row',
    justifyContent: jeTelefon ? 'flex-start' : 'space-between', 
    alignItems: jeTelefon ? 'flex-start' : 'center',
    gap: jeTelefon ? '3px' : '15px',
    padding: '10px 0', 
    borderBottom: '1px solid #eee',
    fontSize: '14.5px'
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: jeTelefon ? '20px 12px' : '30px', backgroundColor: '#f9f9f9', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }}>
      <UpravnikMeni />

      {}
      {}
      <div style={{ display: 'flex', flexDirection: jeMaliEkran ? 'column' : 'row', justifyContent: 'space-between', gap: '15px', marginBottom: '25px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', boxSizing: 'border-box', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
          <label style={{ fontWeight: 'bold', fontSize: 'clamp(13px, 1.2vw, 14.5px)', color: '#555' }}>Pretraga po imenu ili prezimenu:</label>
          <input 
            type="text" 
            value={pretragaIme}
            onChange={(e) => setPretragaIme(e.target.value)}
            placeholder="Npr. Jelena ili Pavlovic..." 
            style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: 'clamp(12.5px, 1.1vw, 14px)', width: '100%', boxSizing: 'border-box', height: '40px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
          <label style={{ fontWeight: 'bold', fontSize: 'clamp(13px, 1.2vw, 14.5px)', color: '#555' }}>Pretraga po sobi:</label>
          <input 
            type="text" 
            value={pretragaSoba}
            onChange={(e) => setPretragaSoba(e.target.value)}
            placeholder="Unesite broj sobe..." 
            style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: 'clamp(12.5px, 1.1vw, 14px)', width: '100%', boxSizing: 'border-box', height: '40px', outline: 'none' }}
          />
        </div>
      </div>

      {}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', overflowX: 'auto', width: '100%', boxSizing: 'border-box', border: '1px solid #eee' }}>
        {filtriraniStudenti.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '40px', fontSize: 'clamp(13px, 1.2vw, 15px)' }}>Nema studenata koji odgovaraju pretrazi.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: jeTelefon ? '100%' : '600px' }}>
            <thead>
              {}
              <tr style={{ backgroundColor: '#f4f6f9', borderBottom: '2px solid #eee', color: '#444', fontSize: 'clamp(12px, 1.1vw, 13.5px)' }}>
                <th style={{ padding: '12px 15px' }}>Soba</th>
                <th style={{ padding: '12px 15px' }}>Ime i prezime</th>
                {sirinaEkrana > 600 && <th style={{ padding: '12px 15px' }}>Broj telefona</th>}
                {sirinaEkrana > 900 && <th style={{ padding: '12px 15px' }}>Email adresa</th>}
              </tr>
            </thead>
            <tbody>
              {filtriraniStudenti.map((student) => {
                const formatiranoIme = student.ime ? student.ime.replace(/([a-z])([A-Z])/g, '$1 $2') : '';
                return (
                  
                  <tr 
                    key={student.id} 
                    onClick={() => setSelektovaniStudent(student)}
                    style={{ borderBottom: '1px solid #eee', cursor: 'pointer', fontSize: 'clamp(12.5px, 1.1vw, 14px)', transition: 'background-color 0.1s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fcfcfc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#007bff' }}>Soba {student.brSobe || 'Nema'}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#333' }}>{formatiranoIme}</td>
                    {sirinaEkrana > 600 && <td style={{ padding: '15px', color: '#555' }}>{student.telefon || '-'}</td>}
                    {sirinaEkrana > 900 && <td style={{ padding: '15px', color: '#555', wordBreak: 'break-all' }}>{student.email || '-'}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {}
      {selektovaniStudent && (
        <div 
          onClick={() => setSelektovaniStudent(null)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300, padding: '20px 10px' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ backgroundColor: 'white', padding: jeTelefon ? '25px 20px' : '30px 25px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '450px', position: 'relative', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <button 
              onClick={() => setSelektovaniStudent(null)} 
              style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}
            >
              x
            </button>
            
            <h3 style={{ color: '#007bff', marginTop: 0, borderBottom: '1px dashed #eee', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
              Detalji o studentu
            </h3>

            <div style={stilRedaModal}>
              <span style={{ color: '#666', fontWeight: 'bold' }}>Soba:</span>
              <span style={{ color: '#333', fontWeight: 'bold' }}>{selektovaniStudent.brSobe || 'Nema dodeljenu sobu'}</span>
            </div>
            <div style={stilRedaModal}>
              <span style={{ color: '#666', fontWeight: 'bold' }}>Ime i prezime:</span>
              <span style={{ color: '#333', fontWeight: 'bold', wordBreak: 'break-word' }}>{selektovaniStudent.ime ? selektovaniStudent.ime.replace(/([a-z])([A-Z])/g, '$1 $2') : ''}</span>
            </div>
            <div style={stilRedaModal}>
              <span style={{ color: '#666', fontWeight: 'bold' }}>Broj indeksa:</span>
              <span style={{ color: '#333', wordBreak: 'break-word' }}>{selektovaniStudent.brIndexa}</span>
            </div>
            <div style={stilRedaModal}>
              <span style={{ color: '#666', fontWeight: 'bold' }}>Fakultet:</span>
              <span style={{ color: '#333', textTransform: 'capitalize', wordBreak: 'break-word' }}>{selektovaniStudent.fakultet || '-'}</span>
            </div>
            <div style={stilRedaModal}>
              <span style={{ color: '#666', fontWeight: 'bold' }}>Smer:</span>
              <span style={{ color: '#333', textTransform: 'capitalize', wordBreak: 'break-word' }}>{selektovaniStudent.smer || '-'}</span>
            </div>
            <div style={stilRedaModal}>
              <span style={{ color: '#666', fontWeight: 'bold' }}>Email adresa:</span>
              <span style={{ color: '#333', wordBreak: 'break-word' }}>{selektovaniStudent.email}</span>
            </div>
            <div style={stilRedaModal}>
              <span style={{ color: '#666', fontWeight: 'bold' }}>Broj telefona:</span>
              <span style={{ color: '#333', wordBreak: 'break-word' }}>{selektovaniStudent.telefon}</span>
            </div>
            <div style={stilRedaModal}>
              <span style={{ color: '#666', fontWeight: 'bold' }}>JMBG:</span>
              <span style={{ color: '#333', wordBreak: 'break-word' }}>{selektovaniStudent.jmbg}</span>
            </div>
            <div style={{ ...stilRedaModal, borderBottom: 'none' }}>
              <span style={{ color: '#666', fontWeight: 'bold' }}>Datum useljenja:</span>
              <span style={{ color: '#333', wordBreak: 'break-word' }}>{formatirajDatum(selektovaniStudent.datumUseljenja)}</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default UpravnikStudenti;
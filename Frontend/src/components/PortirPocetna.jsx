import React, { useState, useEffect } from 'react';
import PortirMeni from './PortirMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const PortirPocetna = () => {
    const [vaznaObavestenja, setVaznaObavestenja] = useState([]);
    const [naslov, setNaslov] = useState('');
    const [tekst, setTekst] = useState('');
    const [poruka, setPoruka] = useState('');
    const [loading, setLoading] = useState(true);
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

    const [prikaziFormu, setPrikaziFormu] = useState(false);
    
    const [prikaziTipInfo, setPrikaziTipInfo] = useState(false);

    useEffect(() => {
        const handleResize = () => setSirinaEkrana(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatirajDatum = (datumString) => {
        if (!datumString) return '';
        const d = new Date(datumString);
        return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
    };

    const fetchVaznaObavestenja = async () => {
        try {
            const res = await fetch(`${konfiguracija.baseURL}/api/pocetna/vazna`);
            if (res.ok) {
                const podaci = await res.json();
                setVaznaObavestenja(podaci);
            } else {
                setPoruka('Greška pri učitavanju oglasne table.');
            }
        } catch (err) {
            console.error(err);
            setPoruka('Nije moguće povezivanje sa serverom.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaznaObavestenja(); 
        
        const interval = setInterval(() => {
            fetchVaznaObavestenja(); 
        }, 2000);

        return () => clearInterval(interval); 
    }, []);

    const handleObjaviVazno = async (e) => {
        e.preventDefault();

        const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
        let portirId = 1; 

        if (sacuvaniKorisnik) {
            const portir = JSON.parse(sacuvaniKorisnik);
            if (portir && (portir.id || portir.Id)) {
                portirId = portir.id || portir.Id;
            }
        }

        const novoObavestenje = {
            Naziv: naslov,
            Tekst: tekst,
            Tip: 'vazno',
            AutorId: portirId 
        };

        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/pocetna/kreiraj`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoObavestenje)
            });

            if (response.ok) {
                setNaslov('');
                setTekst('');
                setPoruka('Uspešno ste postavili obaveštenje na oglasnu tablu!');
                setPrikaziFormu(false); 
                fetchVaznaObavestenja(); 
            } else {
                const tekstGreske = await response.text();
                setPoruka(tekstGreske || 'Greška prilikom slanja na server. Proverite ulogu korisnika u bazi.');
            }
        } catch (err) {
            setPoruka('Greška u komunikaciji sa serverom.');
        }
    };

    const jeTelefon = sirinaEkrana <= 600;

    return (
        <div style={{ 
            width: '100%', 
            minHeight: '100vh', 
            margin: 0, 
            padding: jeTelefon ? '20px 12px' : '30px', 
            backgroundColor: '#f9f9f9', 
            boxSizing: 'border-box', 
            fontFamily: 'Arial, sans-serif' 
        }}>
            <PortirMeni />

            <div style={{ width: '100%', boxSizing: 'border-box' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <button 
                        onClick={() => {
                            setPrikaziFormu(!prikaziFormu);
                            setPoruka(''); 
                        }}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: prikaziFormu ? '#dc3545' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '15px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {prikaziFormu ? 'Zatvori formular' : 'Kreiraj novo važno obaveštenje'}
                    </button>
                </div>

                {prikaziFormu && (
                    <div style={{ maxWidth: '600px', margin: '0 auto 35px auto', boxSizing: 'border-box' }}>
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '30px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid #eee',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            {poruka && (
                                <div style={{
                                    padding: '12px 15px',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    backgroundColor: poruka.includes('Uspešno') ? '#e6f4ea' : '#fce8e6',
                                    color: poruka.includes('Uspešno') ? 'green' : '#dc3545',
                                    border: `1px solid ${poruka.includes('Uspešno') ? '#c3e6cb' : '#f5c6cb'}`,
                                    marginBottom: '20px'
                                }}>
                                    {poruka}
                                </div>
                            )}

                            <form onSubmit={handleObjaviVazno}>
                                <div style={{ marginBottom: '15px' }}>
                                    <h3 style={{ margin: '0 0 20px 0', fontSize: 'clamp(15px, 1.4vw, 18px)', color: '#333', fontWeight: 'bold' }}>
                                        Napiši novo obaveštenje
                                    </h3>

                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Naslov:</label>
                                    <input
                                        type="text"
                                        placeholder="Npr. Ključevi od vešeraja, Paket na portirnici..."
                                        value={naslov}
                                        onChange={e => setNaslov(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 15px',
                                            borderRadius: '6px',
                                            border: '1px solid #ccc',
                                            boxSizing: 'border-box',
                                            fontSize: 'clamp(12.5px, 1.1vw, 14px)',
                                            height: '40px'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Tekst obaveštenja:</label>
                                    <textarea
                                        placeholder="Napišite detalje obaveštenja za studente..."
                                        value={tekst}
                                        onChange={e => setTekst(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 15px',
                                            borderRadius: '6px',
                                            border: '1px solid #ccc',
                                            boxSizing: 'border-box',
                                            fontSize: 'clamp(12.5px, 1.1vw, 14px)',
                                            resize: 'vertical',
                                            fontFamily: 'Arial, sans-serif',
                                            height: '120px'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                                    <button
                                        type="submit"
                                        style={{
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
                                        }}
                                    >
                                        Objavi obaveštenje
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
                                                Klikom na dugme objavi obaveštenje, ono postaje odmah vidljivo svim studentima na oglasnoj tabli.
                                                
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
                        </div>
                    </div>
                )}

                {!prikaziFormu && poruka && poruka.includes('Uspešno') && (
                    <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold', margin: '15px 0', fontSize: '15px' }}>✓ {poruka}</p>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0 35px 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', position: 'relative' }}>
                    <h2 style={{ color: '#333', margin: 0, textAlign: 'left' }}>
                        Prethodne zvanične objave
                    </h2>
                </div>

                {loading ? (
                    <p style={{ color: '#777', fontStyle: 'italic', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Učitavanje table...</p>
                ) : vaznaObavestenja.length === 0 ? (
                    <p style={{ color: '#777', fontStyle: 'italic', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Oglasna table je trenutno prazna.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: sirinaEkrana > 1200 ? 'repeat(3, 1fr)' : sirinaEkrana > 768 ? 'repeat(2, 1fr)' : '1fr',
                        gap: '20px',
                        width: '100%',
                        boxSizing: 'border-box',
                        marginBottom: '20px'
                    }}>
                        {vaznaObavestenja.map((o) => {
                            const trenId = o.id || o.Id;
                            const trenNaziv = o.naziv || o.Naziv;
                            const trenTekst = o.tekst || o.Tekst;
                            const trenDatum = o.datum || o.Datum;

                            return (
                                <div
                                    key={trenId}
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: '20px',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                        border: '1px solid #eee',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px dashed #eee', paddingBottom: '10px', flexWrap: 'wrap', gap: '5px' }}>
                                            <strong style={{ color: '#007bff', fontSize: 'clamp(13.5px, 1.2vw, 15px)' }}>{trenNaziv}</strong>
                                            <span style={{ fontSize: 'clamp(11px, 1vw, 12.5px)', color: '#888', fontWeight: 'bold' }}>{formatirajDatum(trenDatum)}</span>
                                        </div>
                                        <p style={{ color: '#333', margin: 0, fontSize: 'clamp(12.5px, 1.1vw, 14px)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{trenTekst}</p>
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

export default PortirPocetna;
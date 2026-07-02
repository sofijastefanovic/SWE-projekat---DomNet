import React, { useState, useEffect } from 'react';
import StudentMeni from './StudentMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const StudentPocetna = () => {
    const [vaznaObavestenja, setVaznaObavestenja] = useState([]);
    const [poruka, setPoruka] = useState('');
    const [loading, setLoading] = useState(true);
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

    
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
            <StudentMeni />

            <div style={{ width: '100%', boxSizing: 'border-box' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', position: 'relative' }}>
                    <h2 style={{ color: '#333', margin: 0, textAlign: 'left' }}>
                        Zvanična oglasna tabla
                    </h2>
                </div>
                
                <p style={{ color: '#666', marginTop: 0, marginBottom: '30px', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>
                    Najvažnija obaveštenja, tehničke informacije i obaveštenja uprave studentskog doma.
                </p>

                {poruka && (
                    <div style={{
                        padding: '12px 15px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        backgroundColor: '#fce8e6',
                        color: '#dc3545',
                        border: '1px solid #f5c6cb',
                        marginBottom: '20px'
                    }}>
                        {poruka}
                    </div>
                )}

                {loading ? (
                    <p style={{ color: '#777', fontStyle: 'italic', fontSize: 'clamp(13px, 1.2vw, 14.5px)', textAlign: 'center' }}>Učitavanje table...</p>
                ) : vaznaObavestenja.length === 0 ? (
                    <p style={{ color: '#777', fontStyle: 'italic', fontSize: 'clamp(13px, 1.2vw, 14.5px)', textAlign: 'center' }}>Oglasna tabla je trenutno prazna.</p>
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
                                        {}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px dashed #eee', paddingBottom: '10px', flexWrap: 'wrap', gap: '5px' }}>
                                            <strong style={{ color: '#007bff', fontSize: 'clamp(13.5px, 1.2vw, 15px)' }}>{trenNaziv}</strong>
                                            <span style={{ fontSize: 'clamp(11px, 1vw, 12.5px)', color: '#888', fontWeight: 'bold' }}>{formatirajDatum(trenDatum)}</span>
                                        </div>
                                        
                                        <p style={{
                                            margin: '0 0 15px 0',
                                            color: '#333',
                                            fontSize: 'clamp(12.5px, 1.1vw, 14px)',
                                            lineHeight: '1.6',
                                            whiteSpace: 'pre-line' 
                                        }}>
                                            {trenTekst}
                                        </p>
                                    </div>

                                    {}
                                    {o.korisnik && (
                                        <div style={{ borderTop: '1px dashed #eee', paddingTop: '10px', textAlign: 'right' }}>
                                            <span style={{ fontSize: 'clamp(11px, 1vw, 12.5px)', color: '#777', fontStyle: 'italic' }}>
                                                Postavio: <strong style={{ color: '#555', textTransform: 'capitalize' }}>{o.korisnik.uloga}</strong> - {o.korisnik.ime}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPocetna;
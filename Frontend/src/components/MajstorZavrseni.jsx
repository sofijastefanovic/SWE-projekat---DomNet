import React, { useState, useEffect } from 'react';
import MajstorMeni from './MajstorMeni.jsx';
import DetaljiKvaraModal from './DetaljiKvaraModal.jsx';
import konfiguracija from '../konfiguracija.js';

const MajstorZavrseni = () => {
    const [zavrseniKvarovi, setZavrseniKvarovi] = useState([]);
    const [selektovaniKvar, setSelektovaniKvar] = useState(null);
    const [poruka, setPoruka] = useState('');
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

   
    useEffect(() => {
        const handleResize = () => setSirinaEkrana(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

 
    useEffect(() => {
        if (poruka) {
            const tajmer = setTimeout(() => {
                setPoruka('');
            }, 4000);
            return () => clearTimeout(tajmer);
        }
    }, [poruka]);

    
    const formatirajImePrezime = (tekst) => {
        if (!tekst) return 'Nije upisano';
        return tekst.replace(/([a-zšđčćž])([A-ZŠĐČĆŽ])/g, '$1 $2');
    };

  
    const fetchZavrseneKvarove = async () => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/zakazani?t=${Date.now()}`);
            if (response.ok) {
                const podaci = await response.json();
                const filtrirani = podaci.filter(k => (k.status || k.Status) && (k.status || k.Status).toLowerCase() === 'završeno');
                const sortirani = filtrirani.sort((a, b) => new Date(b.datumPopravke || b.DatumPopravke) - new Date(a.datumPopravke || a.DatumPopravke));
                setZavrseniKvarovi(sortirani);
            }
        } catch (error) {
            console.error('Greška pri učitavanju:', error);
            setPoruka('Greška: Nije moguće uspostaviti vezu sa serverom.');
        }
    };


    useEffect(() => {
        fetchZavrseneKvarove();
    }, []);

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            margin: 0,
            padding: '30px',
            backgroundColor: '#f9f9f9',
            boxSizing: 'border-box',
            fontFamily: 'Arial, sans-serif'
        }}>

            <MajstorMeni />

            {poruka && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p style={{
                        color: (poruka.toLowerCase().includes('uspešno') || poruka.toLowerCase().includes('uspeh')) ? 'green' : 'red',
                        backgroundColor: (poruka.toLowerCase().includes('uspešno') || poruka.toLowerCase().includes('uspeh')) ? '#e6f4ea' : '#fce8e6',
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '20px',
                        width: '100%',
                        maxWidth: '550px',
                        boxSizing: 'border-box'
                    }}>
                        {poruka}
                    </p>
                </div>
            )}

            <h2 style={{ color: '#333', marginBottom: '25px' }}>Istorija popravljenih kvarova</h2>

            {zavrseniKvarovi.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '40px' }}>
                    Nemate završenih popravki u istoriji.
                </p>
            ) : (
               
                <ul style={{
                    listStyleType: 'none', padding: 0, margin: 0, display: 'grid',
                    gridTemplateColumns: sirinaEkrana > 1200 ? 'repeat(4, 1fr)' : sirinaEkrana > 900 ? 'repeat(3, 1fr)' : sirinaEkrana > 600 ? 'repeat(2, 1fr)' : '1fr', gap: '20px'
                }}>
                    {zavrseniKvarovi.map((kvar) => {
                        const datum = (kvar.datumPopravke || kvar.DatumPopravke) ? new Date(kvar.datumPopravke || kvar.DatumPopravke) : null;
                        const vrstaKvaraTekst = kvar.vrstaKvara || kvar.VrstaKvara;
                        const lokacijaTekst = kvar.lokacija || kvar.Lokacija;

                        return (
                            <li
                                key={kvar.id}
                                onClick={() => setSelektovaniKvar(kvar)}
                                style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #eee',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.15s ease',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <div>
                                    {}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #eee', paddingBottom: '8px' }}>
                                        <strong style={{ fontSize: '15px', color: '#007bff' }}>
                                            {vrstaKvaraTekst ? vrstaKvaraTekst.split('(')[0].trim() : 'Kvar'}
                                        </strong>
                                    </div>

                                    {datum && (
                                        <p style={{ margin: '5px 0', fontSize: '14.5px', color: '#333' }}>
                                            <strong>Popravljeno:</strong> {datum.toLocaleDateString('sr-RS')} u {datum.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}h
                                        </p>
                                    )}

                                    <p style={{ margin: '5px 0', fontSize: '14.5px', color: '#333' }}>
                                        <strong>Lokacija:</strong> Soba {lokacijaTekst}
                                    </p>

                                    <p style={{ margin: '5px 0', fontSize: '14.5px', color: '#333' }}>
                                        <strong>Prijavio:</strong> {formatirajImePrezime(kvar.imePrezime || kvar.ImePrezime)}
                                    </p>
                                </div>

                                <div style={{ marginTop: '12px', fontSize: '14px' }}>
                                    <strong>Status:</strong>{' '}
                                    <span style={{ fontWeight: 'bold', color: 'green', textTransform: 'uppercase' }}>
                                        ZAVRŠENO
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {selektovaniKvar && <DetaljiKvaraModal kvar={selektovaniKvar} onClose={() => setSelektovaniKvar(null)} />}
        </div>
    );
};

export default MajstorZavrseni;
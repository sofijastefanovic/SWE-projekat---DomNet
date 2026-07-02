import React, { useState, useEffect, useCallback } from 'react';
import MajstorMeni from './MajstorMeni.jsx';
import DetaljiKvaraModal from './DetaljiKvaraModal.jsx';
import ZakaziKvarModal from './ZakaziKvarModal.jsx';
import konfiguracija from '../konfiguracija.js';

const MajstorPocetna = () => {
    const [noviKvarovi, setNoviKvarovi] = useState([]);
    const [poruka, setPoruka] = useState('');
    const [selektovaniKvar, setSelektovaniKvar] = useState(null);
    const [brojNeprocitanih, setBrojNeprocitanih] = useState(0);
    const [kvarZaZakazivanje, setKvarZaZakazivanje] = useState(null);
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);
    const [prikaziInfo, setPrikaziInfo] = useState(false); 

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

    const formatirajDatum = (datumString) => {
        if (!datumString) return 'Nije evidentirano';
        const d = new Date(datumString);
        return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
    };

    const fetchNoveKvarove = useCallback(async () => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/novi?t=${Date.now()}`);
            if (response.ok) {
                const podaci = await response.json();
                const sortirani = podaci.sort((a, b) => new Date(b.datumPrijave) - new Date(a.datumPrijave));
                const pogledaniKvarovi = JSON.parse(localStorage.getItem('majstorPogledaniKvarovi') || '[]');

                let brojac = 0;
                const mapiraniKvarovi = sortirani.map(kvar => {
                    const neprocitan = !pogledaniKvarovi.includes(kvar.id);
                    if (neprocitan) brojac++;
                    return { ...kvar, jeNeprocitan: neprocitan };
                });

                setNoviKvarovi(mapiraniKvarovi);
                setBrojNeprocitanih(brojac);
            }
        } catch (error) {
            console.error('Greška pri učitavanju novih kvarova:', error);
        }
    }, []);

    useEffect(() => {
        fetchNoveKvarove();

        const interval = setInterval(() => {
            fetchNoveKvarove();
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchNoveKvarove]);

    const handleOtvoriDetalje = (kvar) => {
        setSelektovaniKvar(kvar);
        const pogledaniKvarovi = JSON.parse(localStorage.getItem('majstorPogledaniKvarovi') || '[]');
        if (!pogledaniKvarovi.includes(kvar.id)) {
            pogledaniKvarovi.push(kvar.id);
            localStorage.setItem('majstorPogledaniKvarovi', JSON.stringify(pogledaniKvarovi));
            fetchNoveKvarove();
            window.dispatchEvent(new Event('storage'));
        }
    };

    const jeMaliEkran = sirinaEkrana <= 600;

    return (
        
        <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: '30px', backgroundColor: '#f9f9f9', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', overflowX: 'hidden' }}>
            <MajstorMeni />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                    <h2 style={{ color: '#333', margin: 0, fontSize: jeMaliEkran ? '20px' : '24px' }}>Nove prijave kvarova</h2>
                    
                    <div 
                        onMouseEnter={() => setPrikaziInfo(true)}
                        onMouseLeave={() => setPrikaziInfo(false)}
                        onClick={() => setPrikaziInfo(!prikaziInfo)}
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

                        {prikaziInfo && (
                            <div style={{
                                position: 'absolute',
                                top: jeMaliEkran ? '34px' : 'auto',
                                bottom: jeMaliEkran ? 'auto' : '34px', 
                                right: jeMaliEkran ? '-10px' : 'auto', 
                                left: jeMaliEkran ? 'auto' : '0px', 
                                width: jeMaliEkran ? '240px' : '280px',
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
                                Klikom na bilo koju karticu otvara se prozor sa svim detaljima kvara. 
                                Prijava se tada automatski vodi kao <strong>pročitana</strong>, a crveni natpis <strong>"NOVO"</strong> se uklanja.
                                
                                <div style={{
                                    position: 'absolute',
                                    top: jeMaliEkran ? '-5px' : 'auto',
                                    bottom: jeMaliEkran ? 'auto' : '-5px',
                                    right: jeMaliEkran ? '14px' : 'auto',
                                    left: jeMaliEkran ? 'auto' : '10px',
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

                <span style={{
                    backgroundColor: brojNeprocitanih > 0 ? '#dc3545' : '#6c757d',
                    color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold'
                }}>
                    {brojNeprocitanih} {brojNeprocitanih === 1 ? 'nova prijava' : 'novih prijava'}
                </span>
            </div>

            {poruka && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p style={{
                        color: (poruka.toLowerCase().includes('uspešno') || poruka.toLowerCase().includes('uspeh') || poruka.toLowerCase().includes('zakazan')) ? 'green' : 'red',
                        backgroundColor: (poruka.toLowerCase().includes('uspešno') || poruka.toLowerCase().includes('uspeh') || poruka.toLowerCase().includes('zakazan')) ? '#e6f4ea' : '#fce8e6',
                        padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', width: '100%', maxWidth: '550px', boxSizing: 'border-box'
                    }}>
                        {poruka}
                    </p>
                </div>
            )}

            {noviKvarovi.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', marginTop: '40px' }}>Trenutno nema novih prijavljenih kvarova.</p>
            ) : (
                <ul style={{
                    listStyleType: 'none', padding: 0, margin: 0, display: 'grid',
                    gridTemplateColumns: sirinaEkrana > 1200 ? 'repeat(4, 1fr)' : sirinaEkrana > 900 ? 'repeat(3, 1fr)' : sirinaEkrana > 600 ? 'repeat(2, 1fr)' : '1fr', gap: '20px'
                }}>
                    {noviKvarovi.map((kvar) => (
                        <li
                            key={kvar.id}
                            onClick={() => handleOtvoriDetalje(kvar)}
                            style={{
                                backgroundColor: kvar.jeNeprocitan ? '#fffbeb' : 'white',
                                border: kvar.jeNeprocitan ? '1px solid #ffeeba' : '1px solid #eee',
                                padding: '20px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.15s ease',
                                boxSizing: 'border-box'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px dashed #eee', paddingBottom: '8px' }}>
                                    <strong style={{ fontSize: '15px', color: '#007bff' }}>
                                        {kvar.vrstaKvara ? kvar.vrstaKvara.split('(')[0].trim() : (kvar.VrstaKvara ? kvar.VrstaKvara.split('(')[0].trim() : 'Kvar')}
                                    </strong>
                                    {kvar.jeNeprocitan && (
                                        <span style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>Novo</span>
                                    )}
                                </div>

                                <p style={{ margin: '5px 0', fontSize: '14.5px', color: '#333' }}><strong>Prijavio:</strong> {formatirajImePrezime(kvar.imePrezime || kvar.ImePrezime)}</p>
                                <p style={{ margin: '5px 0', fontSize: '14.5px', color: '#333' }}><strong>Lokacija:</strong> Soba {kvar.lokacija || kvar.Lokacija}</p>
                                <p style={{ margin: '5px 0', fontSize: '13.5px', color: '#666' }}><strong>Prijavljeno:</strong> {formatirajDatum(kvar.datumPrijave || kvar.DatumPrijave)}</p>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); setKvarZaZakazivanje(kvar); }}
                                style={{ padding: '11px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', width: '100%', cursor: 'pointer', marginTop: '15px' }}
                            >
                                Zakaži termin
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selektovaniKvar && (
                <DetaljiKvaraModal
                    kvar={selektovaniKvar}
                    onClose={() => setSelektovaniKvar(null)}
                    isMajstor={true}
                    onZakaziTerminKlik={(kvar) => setKvarZaZakazivanje(kvar)}
                />
            )}

            {kvarZaZakazivanje && (
                <ZakaziKvarModal
                    kvar={kvarZaZakazivanje}
                    onClose={() => setKvarZaZakazivanje(null)}
                    onUspeh={() => {
                        fetchNoveKvarove();
                        window.dispatchEvent(new Event('storage'));
                    }}
                    setPoruka={setPoruka}
                />
            )}
        </div>
    );
};

export default MajstorPocetna;
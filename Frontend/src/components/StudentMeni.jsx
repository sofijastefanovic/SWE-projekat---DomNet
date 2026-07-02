import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import konfiguracija from '../konfiguracija.js';

const StudentMeni = () => {
    const location = useLocation();
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);
    const [otvorenMobilniMeni, setOtvorenMobilniMeni] = useState(false);
    const [brojNovih, setBrojNovih] = useState(0);

    useEffect(() => {
        const handleResize = () => setSirinaEkrana(window.innerWidth);
        window.addEventListener('resize', handleResize);

        
        const proveriNovePromene = async () => {
            const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
            const korisnikPodaci = sacuvaniKorisnik ? JSON.parse(sacuvaniKorisnik) : null;
            if (!korisnikPodaci || !korisnikPodaci.id) return;

            const studentId = korisnikPodaci.studentId || korisnikPodaci.id;
            const zadnjaPoseta = parseInt(localStorage.getItem('studentZadnjaPoseta') || '0');

            try {
                const [resKvarovi, resMasine] = await Promise.all([
                    fetch(`${konfiguracija.baseURL}/api/kvarovi/sve`),
                    fetch(`${konfiguracija.baseURL}/api/vesmasine/moje-rezervacije/${studentId}`)
                ]);

                let brojacNovih = 0;

                if (resKvarovi.ok) {
                    const podaci = await resKvarovi.json();
                    const mojiKvarovi = podaci.filter(k => k.korisnikId === korisnikPodaci.id);
                    const noviKvarovi = mojiKvarovi.filter(k => {
                        if (!k.status || k.status.toLowerCase() === 'na čekanju') return false;
                        const vremePromene = new Date(k.datumPopravke || k.vremeZakazivanja || k.datumPrijave).getTime();
                        return vremePromene > zadnjaPoseta;
                    });
                    brojacNovih += noviKvarovi.length;
                }

                if (resMasine.ok) {
                    const podaciMasine = await resMasine.json();
                    const noveMasine = podaciMasine.filter(r => {
                        if (!r.status || r.status.toLowerCase() === 'na cekanju') return false;
                        const vremeOdgovora = new Date(r.datumOdgovora || r.datumZahteva || r.datum).getTime();
                        return vremeOdgovora > zadnjaPoseta;
                    });
                    brojacNovih += noveMasine.length;
                }

                setBrojNovih(brojacNovih);
            } catch (e) {
                console.error('Greška pri proveravanju bedža obaveštenja:', e);
            }
        };

        proveriNovePromene();
        const interval = setInterval(proveriNovePromene, 3000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
        };
    }, [location.pathname]);

    const jeMobilni = sirinaEkrana <= 1024;

    const stilDugmeta = (putanja) => ({
        padding: '10px 16px',
        textDecoration: 'none',
        color: location.pathname === putanja ? 'white' : '#555',
        backgroundColor: location.pathname === putanja ? '#007bff' : 'transparent',
        fontWeight: 'bold',
        borderRadius: '6px',
        transition: 'all 0.2s ease',
        fontSize: '14.5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: jeMobilni ? '100%' : 'auto',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        position: 'relative'
    });

    return (
        <nav style={{
            backgroundColor: 'white', padding: '15px 25px', borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '25px',
            display: 'flex', flexDirection: jeMobilni ? 'column' : 'row',
            justifyContent: 'space-between', alignItems: jeMobilni ? 'stretch' : 'center',
            gap: jeMobilni && otvorenMobilniMeni ? '20px' : '0px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: jeMobilni ? '100%' : 'auto' }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '18px', fontWeight: 'bold' }}>DomNet</h3>

                {jeMobilni && (
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button
                            onClick={() => setOtvorenMobilniMeni(!otvorenMobilniMeni)}
                            style={{ background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', color: '#333', fontWeight: 'bold', padding: 0, width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                        >
                            {otvorenMobilniMeni ? '✕' : '☰'}
                        </button>

                        {brojNovih > 0 && !otvorenMobilniMeni && (
                            <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: '#28a745', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxSizing: 'border-box', pointerEvents: 'none' }}>
                                {brojNovih}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {(!jeMobilni || otvorenMobilniMeni) && (
                <>
                    <div style={{ display: 'flex', flexDirection: jeMobilni ? 'column' : 'row', gap: '8px', alignItems: 'stretch', width: jeMobilni ? '100%' : 'auto', marginTop: jeMobilni ? '10px' : '0' }}>
                        <Link to="/student" style={stilDugmeta('/student')} onClick={() => setOtvorenMobilniMeni(false)}>Početna</Link>
                        <Link to="/student/forum" style={stilDugmeta('/student/forum')} onClick={() => setOtvorenMobilniMeni(false)}>Forum</Link>
                        <Link to="/student/kvarovi" style={stilDugmeta('/student/kvarovi')} onClick={() => setOtvorenMobilniMeni(false)}>Kvarovi</Link>
                        <Link to="/student/masine" style={stilDugmeta('/student/masine')} onClick={() => setOtvorenMobilniMeni(false)}>Dostupnost mašina</Link>
                        <Link to="/student/profil" style={stilDugmeta('/student/profil')} onClick={() => setOtvorenMobilniMeni(false)}>Profil</Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: jeMobilni ? 'column' : 'row', gap: '8px', justifyContent: 'center', width: jeMobilni ? '100%' : 'auto', marginTop: jeMobilni ? '5px' : '0' }}>
                        <Link to="/student/obavestenja" style={stilDugmeta('/student/obavestenja')} onClick={() => setOtvorenMobilniMeni(false)} title="Obaveštenja">
                            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            {brojNovih > 0 && location.pathname !== '/student/obavestenja' && (
                                <span style={{
                                    position: 'absolute', top: '4px', right: jeMobilni ? 'calc(50% - 15px)' : '8px',
                                    backgroundColor: '#28a745', color: 'white', fontSize: '10px',
                                    width: '16px', height: '16px', borderRadius: '50%',
                                    fontWeight: 'bold', display: 'inline-flex', alignItems: 'center',
                                    justifyContent: 'center', padding: 0, boxSizing: 'border-box'
                                }}>
                                    {brojNovih}
                                </span>
                            )}
                        </Link>

                        <Link
                            to="/"
                            onClick={() => {
                                localStorage.removeItem('trenutniKorisnik');
                                sessionStorage.clear();
                            }}
                            style={{ padding: '10px 16px', textDecoration: 'none', color: '#dc3545', border: '1px solid #dc3545', backgroundColor: 'transparent', fontWeight: 'bold', borderRadius: '6px', fontSize: '14.5px', transition: 'all 0.2s ease', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
                        >
                            Odjava
                        </Link>
                    </div>
                </>
            )}
        </nav>
    );
};

export default StudentMeni;
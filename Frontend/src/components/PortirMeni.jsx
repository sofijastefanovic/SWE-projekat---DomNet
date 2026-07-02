import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import konfiguracija from '../konfiguracija.js';

const PortirMeni = () => {
    const location = useLocation();
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);
    const [otvorenMobilniMeni, setOtvorenMobilniMeni] = useState(false);
    const [brojNovih, setBrojNovih] = useState(0);


    const [brojZahtevaMasina, setBrojZahtevaMasina] = useState(0);

    
    useEffect(() => {
        const handleResize = () => setSirinaEkrana(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    const proveriNovaObavestenja = async () => {
        try {
            const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
            if (!sacuvaniKorisnik) return;
            const korisnikPodaci = JSON.parse(sacuvaniKorisnik);
            const mojId = korisnikPodaci.id;

            const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/sve`);
            if (response.ok) {
                const podaci = await response.json();

                const promenjeniKvarovi = podaci.filter(k =>
                    (k.status || k.Status) &&
                    (k.status || k.Status).toLowerCase() !== 'na čekanju' &&
                    (k.korisnikId || k.KorisnikId) === mojId
                );

                const zadnjaPoseta = parseInt(localStorage.getItem('portirZadnjaPoseta') || '0', 10);

                const neprocitani = promenjeniKvarovi.filter(kvar => {
                    const vremePromene = new Date(
                        kvar.datumPopravke || kvar.DatumPopravke ||
                        kvar.vremeZakazivanja || kvar.VremeZakazivanja ||
                        kvar.datumZakazivanja || kvar.DatumZakazivanja ||
                        kvar.datumPrijave || kvar.DatumPrijave
                    ).getTime();

                    return vremePromene > zadnjaPoseta;
                });

                setBrojNovih(neprocitani.length);
            }
        } catch (error) {
            console.error('Greška pri osvežavanju broja obaveštenja:', error);
        }
    };

   
    const proveriZahteveZaMasine = async () => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/vesmasine/zahtevi?t=${Date.now()}`);
            if (response.ok) {
                const podaci = await response.json();
                
                const naCekanju = podaci.filter(z => z.status === 'na cekanju');
                setBrojZahtevaMasina(naCekanju.length);
            }
        } catch (error) {
            console.error('Greška pri osvežavanju broja zahteva za mašine:', error);
        }
    };


    useEffect(() => {
        proveriNovaObavestenja();
        proveriZahteveZaMasine();

        window.addEventListener('storage', proveriNovaObavestenja);

        const interval = setInterval(() => {
            proveriNovaObavestenja();
            proveriZahteveZaMasine();
        }, 4000);

        return () => {
            window.removeEventListener('storage', proveriNovaObavestenja);
            clearInterval(interval);
        };
    }, []);

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
            gap: jeMobilni && otvorenMobilniMeni ? '15px' : '0px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: jeMobilni ? '100%' : 'auto' }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '18px', fontWeight: 'bold' }}>DomNet <small style={{ fontWeight: 'normal', color: '#888' }}></small></h3>

                {jeMobilni && (
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button
                            onClick={() => setOtvorenMobilniMeni(!otvorenMobilniMeni)}
                            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#333', position: 'relative', padding: 0, width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                        >
                            {otvorenMobilniMeni ? '✕' : '☰'}
                        </button>

                        {}
                        {!otvorenMobilniMeni && (brojNovih > 0 || brojZahtevaMasina > 0) && (
                            <span style={{
                                position: 'absolute', top: '-2px', right: '-2px', backgroundColor: '#dc3545', color: 'white',
                                fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', width: '16px', height: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1', pointerEvents: 'none'
                            }}>
                                {brojNovih + brojZahtevaMasina}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {(!jeMobilni || otvorenMobilniMeni) && (
                <>
                    <div style={{ display: 'flex', flexDirection: jeMobilni ? 'column' : 'row', gap: '8px', alignItems: 'stretch', width: jeMobilni ? '100%' : 'auto', marginTop: jeMobilni ? '10px' : '0' }}>
                        <Link to="/portir" style={stilDugmeta('/portir')} onClick={() => setOtvorenMobilniMeni(false)}>Početna</Link>
                        <Link to="/portir/izvestaji" style={stilDugmeta('/portir/izvestaji')} onClick={() => setOtvorenMobilniMeni(false)}>Dnevni izveštaji</Link>

                        {}
                        <Link to="/portir/masine" style={stilDugmeta('/portir/masine')} onClick={() => setOtvorenMobilniMeni(false)}>
                            Veš mašine
                            {brojZahtevaMasina > 0 && (
                                <span style={{
                                    marginLeft: '8px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    borderRadius: '10px',
                                    padding: '2px 8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    lineHeight: '1'
                                }}>
                                    {brojZahtevaMasina}
                                </span>
                            )}
                        </Link>

                        <Link to="/portir/kvarovi" style={stilDugmeta('/portir/kvarovi')} onClick={() => setOtvorenMobilniMeni(false)}>Prijava kvarova</Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: jeMobilni ? 'column' : 'row', gap: '8px', justifyContent: 'center', width: jeMobilni ? '100%' : 'auto', marginTop: jeMobilni ? '5px' : '0' }}>
                        <Link to="/portir/obavestenja" style={stilDugmeta('/portir/obavestenja')} onClick={() => setOtvorenMobilniMeni(false)} title="Obaveštenja">
                            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            {brojNovih > 0 && location.pathname !== '/portir/obavestenja' && (
                                <span style={{
                                    position: 'absolute', top: '4px', right: jeMobilni ? 'calc(50% - 15px)' : '8px',
                                    backgroundColor: '#dc3545', color: 'white', fontSize: '10px',
                                    width: '16px', height: '16px', borderRadius: '50%',
                                    fontWeight: 'bold', display: 'inline-flex', alignItems: 'center',
                                    justifyContent: 'center', padding: 0, boxSizing: 'border-box'
                                }}>
                                    {brojNovih}
                                </span>
                            )}
                        </Link>

                        <Link to="/" onClick={() => { localStorage.removeItem('trenutniKorisnik'); sessionStorage.clear(); }} style={{ padding: '10px 16px', textDecoration: 'none', color: '#dc3545', border: '1px solid #dc3545', fontWeight: 'bold', borderRadius: '6px', fontSize: '14.5px', width: '100%', textAlign: 'center' }}>
                            Odjava
                        </Link>
                    </div>
                </>
            )}
        </nav>
    );
};

export default PortirMeni;
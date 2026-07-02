import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentMeni from './StudentMeni.jsx';
import DetaljiKvaraModal from './DetaljiKvaraModal.jsx';
import konfiguracija from '../konfiguracija.js';

const StudentKvarovi = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [vrstaKvara, setVrstaKvara] = useState('');
    const [lokacija, setLokacija] = useState('');
    const [opis, setOpis] = useState('');
    const [poruka, setPoruka] = useState('');
    const [istorijaPrijava, setIstorijaPrijava] = useState([]);
    const [otvorenProzor, setOtvorenProzor] = useState(false);
    const [selektovaniKvar, setSelektovaniKvar] = useState(null);
    const [otvorenMeniKvara, setOtvorenMeniKvara] = useState(false);
    const [kvarZaOtkazivanje, setKvarZaOtkazivanje] = useState(null);
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);
    const [prikaziInfo, setPrikaziInfo] = useState(false);
    const [prikaziStatusInfo, setPrikaziStatusInfo] = useState(false);

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

    const formatirajDatum = (datumString) => {
        if (!datumString) return 'Nije evidentirano';
        const d = new Date(datumString);
        return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
    };

    const odrediBojuStatusa = (status, datumZakazivanja) => {
        if (!status) return '#007bff';
        const s = status.toLowerCase();
        if (s === 'završeno') return 'green';
        if (s === 'na čekanju') return '#fd7e14';
        if (s === 'zakazano') {
            const trenchesVreme = new Date().getTime();
            return datumZakazivanja && new Date(datumZakazivanja).getTime() + (2 * 60 * 60 * 1000) < trenchesVreme ? '#dc3545' : '#007bff';
        }
        return '#007bff';
    };

    const prikaziTekstStatusa = (status, datumZakazivanja) => {
    if (!status) return '';
    if (status.toLowerCase() === 'zakazano') {
        const trenchesVreme = new Date().getTime();
        if (datumZakazivanja && new Date(datumZakazivanja).getTime() + (2 * 60 * 60 * 1000) < trenchesVreme) {
            return 'Prekoračeno';
        }
    }
    return status;
    };

    const fetchIstoriju = useCallback(async () => {
    try {
        const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
        if (!sacuvaniKorisnik) return;
        const korisnikPodaci = JSON.parse(sacuvaniKorisnik);
        const mojKorisnikId = korisnikPodaci.korisnikId || korisnikPodaci.id;

        const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/sve?t=${Date.now()}`);
        if (response.ok) {
            const podaci = await response.json();
            const mojiKvarovi = podaci.filter(k => k.korisnikId === mojKorisnikId);
            
            const sortirani = mojiKvarovi.sort((a, b) => {
                const dodeliPrioritet = (status) => {
                    const s = (status || '').toLowerCase();
                    if (s === 'na čekanju') return 1;
                    if (s === 'zakazano') return 2; 
                    if (s === 'završeno') return 3;
                    return 4; 
                };

                const prioritetA = dodeliPrioritet(a.status);
                const prioritetB = dodeliPrioritet(b.status);

                if (prioritetA !== prioritetB) {
                    return prioritetA - prioritetB;
                }

                const vremeA = a.datumZakazivanja ? new Date(a.datumZakazivanja).getTime() : new Date(a.datumPrijave).getTime();
                const vremeB = b.datumZakazivanja ? new Date(b.datumZakazivanja).getTime() : new Date(b.datumPrijave).getTime();

                return vremeB - vremeA;
            });

            setIstorijaPrijava(sortirani);
        }
    } catch (error) {
        console.error('Greška pri učitavanju istorije:', error);
    }
}, []);

    useEffect(() => {
        fetchIstoriju();

        const interval = setInterval(() => {
            fetchIstoriju();
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchIstoriju]);

    const izvrsiOtkazivanjeKvara = async (id) => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setPoruka('Prijava kvara je uspešno otkazana.');
                fetchIstoriju();
            } else {
                const backendGreska = await response.text();
                setPoruka(`Greška pri otkazivanju: ${backendGreska || 'Status ' + response.status}`);
            }
        } catch (error) {
            console.error('Greška:', error);
            setPoruka('Nije moguće uspostaviti vezu sa serverom.');
        } finally {
            setKvarZaOtkazivanje(null);
        }
    };

    useEffect(() => {
        if (location.state?.autoOpenKvarId && istorijaPrijava.length > 0) {
            const pronadjeniKvar = istorijaPrijava.find(k => k.id === location.state.autoOpenKvarId);
            if (pronadjeniKvar) {
                setSelektovaniKvar(pronadjeniKvar);
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [istorijaPrijava, location.state, navigate, location.pathname]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!vrstaKvara) {
            setPoruka('Molimo vas da izaberete vrstu kvara.');
            return;
        }

        const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
        if (!sacuvaniKorisnik) {
            setPoruka('Greška: Sesija je istekla.');
            return;
        }
        const korisnikPodaci = JSON.parse(sacuvaniKorisnik);

        const noviKvar = {
            korisnikId: korisnikPodaci.id,
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
                const errorText = await response.text();
                console.error('Backend greška:', errorText);
                setPoruka('Greška: ' + errorText);
            }
        } catch (error) {
            console.error('Greška:', error);
            setPoruka('Nije moguće uspostaviti vezu sa serverom.');
        }
    };

    const jeMaliEkran = sirinaEkrana <= 600;

    return (
        <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: jeMaliEkran ? '20px 12px' : '30px', backgroundColor: '#f9f9f9', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', scrollbarGutter: 'stable' }}>
            <StudentMeni />

            {poruka && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p style={{ color: (poruka.includes('uspešno') || poruka.includes('otkazana')) ? 'green' : 'red', backgroundColor: (poruka.includes('uspešno') || poruka.includes('otkazana')) ? '#e6f4ea' : '#fce8e6', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', width: '100%', maxWidth: '550px', boxSizing: 'border-box' }}>
                        {poruka}
                    </p>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <button
                    onClick={() => {
                        setPoruka('');
                        setVrstaKvara('');
                        setOtvorenMeniKvara(false);
                        setOtvorenProzor(true);
                    }}
                    style={{ padding: '14px 28px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,123,255,0.15)', transition: 'all 0.2s ease' }}
                >
                    Prijavi novi kvar
                </button>
            </div>

            {otvorenProzor && (
                <div onClick={() => setOtvorenProzor(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflowY: 'auto', zIndex: 1200, padding: '40px 15px' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '35px 25px 25px 25px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '450px', position: 'relative', textAlign: 'left', boxSizing: 'border-box', margin: 'auto' }}>
                        <button
                            onClick={() => setOtvorenProzor(false)}
                            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}
                        >
                            x
                        </button>
                        <h2 style={{ color: '#007bff', marginTop: 0, marginBottom: '20px', textAlign: 'center', fontSize: '24px' }}>Prijava novog kvara</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', boxSizing: 'border-box' }}>

                            <div style={{ width: '100%', display: 'block', boxSizing: 'border-box', position: 'relative' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', color: '#333', marginBottom: '5px' }}>Vrsta kvara: *</label>
                                <div onClick={() => setOtvorenMeniKvara(!otvorenMeniKvara)} style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', height: '40px', fontSize: '14px', cursor: 'pointer', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
                                    <span style={{ color: vrstaKvara ? '#333' : '#888' }}>{vrstaKvara || '-- Izaberi vrstu kvara --'}</span>
                                    <span style={{ fontSize: '11px', color: '#888' }}>{otvorenMeniKvara ? '▲' : '▼'}</span>
                                </div>
                                {otvorenMeniKvara && (
                                    <div style={{ position: 'absolute', top: '65px', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1300, maxHeight: '200px', overflowY: 'auto', boxSizing: 'border-box' }}>
                                        {['Vodovod (cevi, slavine...)', 'Elektrika (svetla, utičnice...)', 'Stolarija (vrata, prozori...)', 'Grejanje', 'Ostalo'].map((opcija) => (
                                            <div key={opcija} onClick={() => { setVrstaKvara(opcija); setOtvorenMeniKvara(false); }} style={{ padding: '10px 12px', cursor: 'pointer', fontSize: '14px', backgroundColor: vrstaKvara === opcija ? '#e6f4ea' : 'white', color: '#333', borderBottom: '1px solid #eee', textAlign: 'left', transition: 'background-color 0.15s ease' }}>{opcija}</div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={{ width: '100%', display: 'block', boxSizing: 'border-box' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', color: '#333', marginBottom: '5px' }}>Lokacija (Broj sobe): *</label>
                                <input type="text" value={lokacija} onChange={(e) => setLokacija(e.target.value)} placeholder="Npr. 413" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px', height: '40px' }} />
                            </div>

                            <div style={{ width: '100%', display: 'block', boxSizing: 'border-box' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', color: '#333', marginBottom: '5px' }}>Opis problema:</label>
                                <textarea value={opis} onChange={(e) => setOpis(e.target.value)} placeholder="Opišite detaljnije šta ne radi..." rows="4" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'Arial', fontSize: '14px' }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                                    Pošalji prijavu majstoru
                                </button>

                                <div 
                                    onMouseEnter={() => setPrikaziInfo(true)}
                                    onMouseLeave={() => setPrikaziInfo(false)}
                                    onClick={() => setPrikaziInfo(!prikaziInfo)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#6c757d',
                                        color: 'white', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                                        userSelect: 'none', position: 'relative', transition: 'background-color 0.2s ease', flexShrink: 0
                                    }}
                                >
                                    ?
                                    {prikaziInfo && (
                                        <div style={{ position: 'absolute', bottom: '36px', right: '-5px', width: jeMaliEkran ? '220px' : '240px', backgroundColor: '#333', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '12.5px', lineHeight: '1.4', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1500, fontWeight: 'normal', textAlign: 'left' }}>
                                            Nakon slanja, vaša prijava automatski dobija status <strong>"Na čekanju"</strong> i odmah je vidljiva majstoru. Čim majstor odredi termin, dobićete obaveštenje.
                                            <div style={{ position: 'absolute', bottom: '-5px', right: '12px', width: '0', height: '0', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #333' }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0 35px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', position: 'relative' }}>
                <h2 style={{ color: '#333', margin: 0, textAlign: 'left', fontSize: jeMaliEkran ? '20px' : '24px' }}>Istorija mojih prijava</h2>
                
                <div 
                    onMouseEnter={() => setPrikaziStatusInfo(true)}
                    onMouseLeave={() => setPrikaziStatusInfo(false)}
                    onClick={() => setPrikaziStatusInfo(!prikaziStatusInfo)}
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

                    
                    {prikaziStatusInfo && (
                        <div style={{
                            position: 'absolute',
                            bottom: '34px',
                            left: jeMaliEkran ? '-150px' : '0px', 
                            width: jeMaliEkran ? '250px' : '280px',
                            backgroundColor: '#333',
                            color: 'white',
                            padding: '14px',
                            borderRadius: '8px',
                            fontSize: '12.5px',
                            lineHeight: '1.5',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                            zIndex: 1500,
                            fontWeight: 'normal',
                            textAlign: 'left'
                        }}>
                            <strong style={{ display: 'block', marginBottom: '6px', borderBottom: '1px solid #555', paddingBottom: '4px', color: '#007bff' }}>Značenje statusa kvara:</strong>
                            • <span style={{ color: '#fd7e14', fontWeight: 'bold' }}>NA ČEKANJU:</span> Kvar je uspešno prijavljen i čeka obradu majstora.<br />
                            • <span style={{ color: '#007bff', fontWeight: 'bold' }}>ZAKAZANO:</span> Majstor je definisao tačan termin dolaska.<br />
                            • <span style={{ color: '#dc3545', fontWeight: 'bold' }}>PREKORAČENO:</span> Zakazani termin je prošao, a nalog još nije zatvoren.<br />
                            • <span style={{ color: 'green', fontWeight: 'bold' }}>ZAVRŠENO:</span> Popravka je uspešno izvršena.
                            
                            <div style={{
                                position: 'absolute',
                                bottom: '-5px',
                                left: jeMaliEkran ? '156px' : '10px', 
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

            {istorijaPrijava.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>Nemate prethodnih prijava kvarova.</p>
            ) : (
                <ul style={{
                    listStyleType: 'none', padding: 0, margin: 0, display: 'grid',
                    gridTemplateColumns: sirinaEkrana > 1200 ? 'repeat(4, 1fr)' : sirinaEkrana > 900 ? 'repeat(3, 1fr)' : sirinaEkrana > 600 ? 'repeat(2, 1fr)' : '1fr', gap: '20px'
                }}>
                    {istorijaPrijava.map((kvar) => {
                        const trenutnaBoja = odrediBojuStatusa(kvar.status, kvar.datumZakazivanja);

                        return (
                            <li
                                key={kvar.id}
                                onClick={() => setSelektovaniKvar(kvar)}
                                style={{
                                    backgroundColor: 'white',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    border: '1px solid #eee',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #eee', paddingBottom: '8px' }}>
                                        <strong style={{ fontSize: '15px', color: '#007bff' }}>{kvar.vrstaKvara?.split('(')[0].trim()}</strong>
                                    </div>
                                    <p style={{ margin: '5px 0', fontSize: '14.5px', color: '#333' }}><strong>Termin:</strong> {formatirajDatum(kvar.datumZakazivanja)}</p>
                                    {kvar.lokacija && <p style={{ margin: '5px 0', fontSize: '14.5px', color: '#333' }}><strong>Lokacija:</strong> Soba {kvar.lokacija}</p>}
                                </div>

                                <div style={{ marginTop: '12px', fontSize: '14px' }}>
                                    <div>
                                        <strong>Status:</strong>{' '}
                                        <span style={{ fontWeight: 'bold', color: trenutnaBoja, textTransform: 'uppercase' }}>
                                            {prikaziTekstStatusa(kvar.status, kvar.datumZakazivanja)}
                                        </span>
                                    </div>

                                    {kvar.status?.toLowerCase() === 'na čekanju' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setKvarZaOtkazivanje(kvar);
                                            }}
                                            style={{
                                                padding: '11px', backgroundColor: '#dc3545', color: 'white',
                                                border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px',
                                                cursor: 'pointer', width: '100%', textAlign: 'center', marginTop: '15px',
                                                transition: 'background-color 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => { e.target.style.backgroundColor = '#c82333'; }}
                                            onMouseLeave={(e) => { e.target.style.backgroundColor = '#dc3545'; }}
                                        >
                                            Otkaži prijavu
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {kvarZaOtkazivanje && (
                <div
                    onClick={() => setKvarZaOtkazivanje(null)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1400, padding: '20px' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', padding: '30px 25px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px', textAlign: 'center', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }}
                    >
                        <h3 style={{ color: '#dc3545', marginTop: 0, marginBottom: '15px' }}>Otkazivanje prijave</h3>
                        <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.5', marginBottom: '25px', fontWeight: 'bold' }}>
                            Da li ste sigurni da želite da otkažete ovu prijavu kvara?
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setKvarZaOtkazivanje(null)}
                                style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                            >
                                Odustani
                            </button>
                            <button
                                onClick={() => izvrsiOtkazivanjeKvara(kvarZaOtkazivanje.id)}
                                style={{ flex: 1, padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                            >
                                Da, otkaži
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selektovaniKvar && (
                <DetaljiKvaraModal kvar={selektovaniKvar} onClose={() => setSelektovaniKvar(null)} isMajstor={false} />
            )}
        </div>
    );
};

export default StudentKvarovi;
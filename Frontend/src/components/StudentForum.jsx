import React, { useState, useEffect } from 'react';
import StudentMeni from './StudentMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const StudentForum = () => {
    const [objave, setObjave] = useState([]);
    const [naslov, setNaslov] = useState('');
    const [tekst, setTekst] = useState('');
    const [loading, setLoading] = useState(true);
    const [prikaziFormu, setPrikaziFormu] = useState(false);
    
    const [poruka, setPoruka] = useState('');
    
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

    const [lajkovaneObjave, setLajkovaneObjave] = useState({});
    const [noviKomentarTekst, setNoviKomentarTekst] = useState({});
    const [prikaziTipInfo, setPrikaziTipInfo] = useState(false);

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
        if (!datumString) return '';
        const d = new Date(datumString);
        return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
    };

    const fetchForumObjave = async () => {
        try {
            const res = await fetch(`${konfiguracija.baseURL}/api/forum`); 
            if (res.ok) {
                const podaci = await res.json();
                setObjave(podaci);
            }
        } catch (err) {
            console.error("Greška pri učitavanju foruma:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForumObjave();
        
        const interval = setInterval(() => {
            fetchForumObjave();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleObjaviNaForum = async (e) => {
        e.preventDefault();
        setPoruka(''); 

        const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
        if (!sacuvaniKorisnik) return;
        const student = JSON.parse(sacuvaniKorisnik);

        const novaObjava = {
            naziv: naslov,
            tekst: tekst,
            tip: 'obicno', 
            autorId: student.id || student.Id
        };

        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/forum`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaObjava)
            });

            if (response.ok) {
                setNaslov('');
                setTekst('');
                setPrikaziFormu(false);
                setPoruka('Tema je uspešno objavljena na forumu!'); 
                fetchForumObjave(); 
            } else {
                setPoruka('Došlo je do greške prilikom objavljivanja teme.');
            }
        } catch (err) {
            console.error("Greška pri slanju objave:", err);
            setPoruka('Nije moguće uspostaviti vezu sa serverom.');
        }
    };

    const handleDodajKomentar = async (e, objavaId) => {
        e.preventDefault();
        const tekstKomentara = noviKomentarTekst[objavaId];
        if (!tekstKomentara || !tekstKomentara.trim()) return;

        const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
        if (!sacuvaniKorisnik) return;
        const student = JSON.parse(sacuvaniKorisnik);

        const noviKomentar = {
            tekst: tekstKomentara,
            obavestenjeId: objavaId,
            autorId: student.id || student.Id
        };

        try {
            const res = await fetch(`${konfiguracija.baseURL}/api/forum/komentar`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noviKomentar)
            });

            if (res.ok) {
                setNoviKomentarTekst(prev => ({ ...prev, [objavaId]: '' }));
                fetchForumObjave(); 
            }
        } catch (err) {
            console.error("Greška pri slanju komentara:", err);
        }
    };

    const toggleLajk = async (id) => {
        const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
        if (!sacuvaniKorisnik) return;
        const student = JSON.parse(sacuvaniKorisnik);

        setLajkovaneObjave(prev => ({ ...prev, [id]: !prev[id] }));

        try {
            const res = await fetch(`${konfiguracija.baseURL}/api/forum/lajk`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    obavestenjeId: id,
                    autorId: student.id || student.Id
                })
            });

            if (res.ok) {
                fetchForumObjave(); 
            } else {
                setLajkovaneObjave(prev => ({ ...prev, [id]: !prev[id] }));
            }
        } catch (err) {
            console.error("Greška pri slanju lajka:", err);
            setLajkovaneObjave(prev => ({ ...prev, [id]: !prev[id] }));
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
            <StudentMeni />

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
                        {prikaziFormu ? 'Zatvori formular' : 'Kreiraj novu objavu na forumu'}
                    </button>
                </div>

                {poruka && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{
                            color: (poruka.toLowerCase().includes('uspešno') || poruka.toLowerCase().includes('uspeh')) ? 'green' : 'red',
                            backgroundColor: (poruka.toLowerCase().includes('uspešno') || poruka.toLowerCase().includes('uspeh')) ? '#e6f4ea' : '#fce8e6',
                            padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', width: '100%', maxWidth: '550px', boxSizing: 'border-box'
                        }}>
                            {poruka}
                        </p>
                    </div>
                )}

                {prikaziFormu && (
                    <div style={{ maxWidth: '600px', margin: '0 auto 30px auto', boxSizing: 'border-box' }}>
                        <form onSubmit={handleObjaviNaForum} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: 'clamp(15px, 1.4vw, 18px)', color: '#333', fontWeight: 'bold' }}>Nova tema za diskusiju</h3>
                            
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Naslov teme:</label>
                            <input
                                type="text"
                                placeholder="Npr. Menjam sobu..."
                                value={naslov}
                                onChange={e => setNaslov(e.target.value)}
                                required
                                style={{ width: '100%', height: '40px', padding: '10px 15px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: 'clamp(12.5px, 1.1vw, 14px)', boxSizing: 'border-box' }}
                            />
                            
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Tekst objave:</label>
                            <textarea
                                placeholder="Šta želiš da napišeš ili pitaš kolege?"
                                value={tekst}
                                onChange={e => setTekst(e.target.value)}
                                required
                                style={{ width: '100%', height: '120px', padding: '10px 15px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc', fontSize: 'clamp(12.5px, 1.1vw, 14px)', resize: 'vertical', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }}
                            />
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', position: 'relative' }}>
                                <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', height: '42px', transition: 'background-color 0.2s' }}>
                                    Objavi na forumu
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
                                            right: jeTelefon ? '-10px' : '0px',
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
                                            Klikom na dugme objavi, vaša tema će postati odmah vidljiva svim studentima na forumu za diskusiju.
                                            
                                            <div style={{
                                                position: 'absolute',
                                                top: '-5px',
                                                right: jeTelefon ? '16px' : '6px',
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
                )}

                <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0 35px 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', position: 'relative' }}>
                    <h2 style={{ color: '#333', margin: 0, textAlign: 'left' }}>
                        Sve objave na forumu
                    </h2>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', color: '#777', fontStyle: 'italic', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Učitavanje objava...</p>
                ) : objave.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#777', fontStyle: 'italic', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Trenutno nema objavljenih tema na forumu.</p>
                ) : (
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: sirinaEkrana > 1200 ? 'repeat(3, 1fr)' : sirinaEkrana > 768 ? 'repeat(2, 1fr)' : '1fr', 
                        gap: '20px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        {objave.map((o) => {
                            const autorObjave = o.korisnik?.ime || o.Korisnik?.Ime || o.autorIme || "Student";
                            const prvoSlovo = autorObjave.charAt(0).toUpperCase();

                            return (
                                <div key={o.id || o.Id} style={{ 
                                    backgroundColor: 'white', 
                                    borderRadius: '8px', 
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)', 
                                    border: '1px solid #eee',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxSizing: 'border-box'
                                }}>

                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px dashed #eee' }}>
                                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#007bff', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '13px' }}>
                                                {prvoSlovo}
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                                                <span style={{ fontWeight: 'bold', color: '#333', fontSize: '13.5px' }}>
                                                    {autorObjave}
                                                </span>
                                                <span style={{ color: '#888', fontSize: '11.5px', fontWeight: 'bold' }}>
                                                    {formatirajDatum(o.datum || o.Datum)}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ padding: '15px', backgroundColor: '#fff' }}>
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#007bff', fontWeight: 'bold' }}>
                                                {o.naziv || o.Naziv}
                                            </h4>
                                            <p style={{ margin: '0 0 10px 0', fontSize: '13.5px', color: '#333', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                                                {o.tekst || o.Tekst}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ padding: '10px 15px 5px 15px', display: 'flex', gap: '16px', borderTop: '1px solid #f5f5f5' }}>
                                            <span onClick={() => toggleLajk(o.id || o.Id)} style={{ fontSize: '22px', cursor: 'pointer', userSelect: 'none' }}>
                                                {lajkovaneObjave[o.id || o.Id] ? '❤️' : '🤍'}
                                            </span>
                                            <span style={{ fontSize: '22px', cursor: 'default', userSelect: 'none' }}>💬</span>
                                        </div>

                                        <div style={{ padding: '0 15px', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#444' }}>
                                                {(o.brojLajkova || o.BrojLajkova) === 1 ? '1 lajk' : `${o.brojLajkova || o.BrojLajkova || 0} lajkova`}
                                            </span>
                                        </div>

                                        <div style={{ padding: '10px 15px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#fafafa', borderTop: '1px solid #f9f9f9', maxHeight: '120px', overflowY: 'auto' }}>
                                            {(o.komentari || o.Komentari) && (o.komentari || o.Komentari).length > 0 ? (
                                                (o.komentari || o.Komentari).map((k) => {
                                                    const autorKomentara = k.korisnik?.ime || k.Korisnik?.Ime || k.autorIme || "Kolega";
                                                    return (
                                                        <div key={k.id || k.Id} style={{ fontSize: '12.5px', lineHeight: '1.4' }}>
                                                            <span style={{ fontWeight: 'bold', color: '#333', marginRight: '6px' }}>
                                                                {autorKomentara}:
                                                            </span>
                                                            <span style={{ color: '#555' }}>{k.tekst || k.Tekst}</span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <small style={{ color: '#888', fontStyle: 'italic' }}>Nema komentara.</small>
                                            )}
                                        </div>

                                        <form onSubmit={(e) => handleDodajKomentar(e, o.id || o.Id)} style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #eee', padding: '10px 15px', backgroundColor: '#fff', borderRadius: '0 0 8px 8px' }}>
                                            <input
                                                type="text"
                                                placeholder="Dodaj komentar..."
                                                value={noviKomentarTekst[o.id || o.Id] || ''}
                                                onChange={(e) => setNoviKomentarTekst(prev => ({ ...prev, [o.id || o.Id]: e.target.value }))}
                                                required
                                                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: '#333', backgroundColor: 'transparent' }}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!noviKomentarTekst[o.id || o.Id]?.trim()}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#007bff',
                                                    fontWeight: 'bold',
                                                    fontSize: '13px',
                                                    cursor: 'pointer',
                                                    opacity: noviKomentarTekst[o.id || o.Id]?.trim() ? 1 : 0.3
                                                }}
                                            >
                                                Objavi
                                            </button>
                                        </form>
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

export default StudentForum;
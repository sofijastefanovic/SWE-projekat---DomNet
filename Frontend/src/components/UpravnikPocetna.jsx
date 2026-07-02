import React, { useState, useEffect } from 'react';
import UpravnikMeni from './UpravnikMeni.jsx'; 
import konfiguracija from '../konfiguracija.js';

const UpravnikPocetna = () => {
    const [naziv, setNaziv] = useState('');
    const [tekst, setTekst] = useState('');

    const [mojeObjave, setMojeObjave] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [poruka, setPoruka] = useState(''); 
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

    const [prikaziFormu, setPrikaziFormu] = useState(false);
    const [prikaziTipInfo, setPrikaziTipInfo] = useState(false);
    const [obavestenjeZaBrisanje, setObavestenjeZaBrisanje] = useState(null);

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

    const ucitajObjave = async () => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/pocetna/vazna`);
            if (response.ok) {
                const data = await response.json();
                setMojeObjave(data);
            } else {
                console.error("Server je vratio grešku pri čitanju obaveštenja.");
            }
        } catch (err) {
            console.error("Greška pri osvežavanju liste:", err);
        }
    };

    useEffect(() => {
        ucitajObjave();
        
        const interval = setInterval(() => {
            ucitajObjave();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSlanje = async (e) => {
        e.preventDefault();

        if (!naziv.trim() || !tekst.trim()) {
            setPoruka("Greška: Morate popuniti i naziv i tekst obaveštenja.");
            return;
        }

        setLoading(true);
        setPoruka('');

        const novoObavestenje = {
            Naziv: naziv,
            Tekst: tekst,
            Tip: "vazno",
            AutorId: 2
        };

        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/pocetna/kreiraj`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoObavestenje),
            });

            if (!response.ok) {
                const tekstGreske = await response.text();
                throw new Error(tekstGreske || 'Došlo je do greške prilikom čuvanja obaveštenja na serveru.');
            }

            setNaziv('');
            setTekst('');
            setPoruka('Obaveštenje je uspešno objavljeno!');
            setPrikaziFormu(false);

            await ucitajObjave();

        } catch (err) {
            setPoruka(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBrisanje = async (id) => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/pocetna/obrisi/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMojeObjave(prev => prev.filter(o => (o.id || o.Id) !== id));
                setPoruka('Obaveštenje je uspešno obrisano!');
            } else {
                setPoruka("Greška prilikom brisanja obaveštenja sa servera.");
            }
        } catch (err) {
            console.error("Greška pri brisanju:", err);
            setPoruka("Došlo je do mrežne greške pri brisanju.");
        } finally {
            setObavestenjeZaBrisanje(null);
        }
    };

    const formatirajDatum = (dateString) => {
        if (!dateString) return "Nije definisan";
        const opcije = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('sr-RS', opcije);
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
            <UpravnikMeni />

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
                            <h3 style={{ margin: '0 0 20px 0', fontSize: 'clamp(15px, 1.4vw, 18px)', color: '#333', fontWeight: 'bold' }}>Novo obaveštenje za studente</h3>
                            <form onSubmit={handleSlanje}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>
                                        Naslov obaveštenja:
                                    </label>
                                    <input
                                        type="text"
                                        value={naziv}
                                        onChange={(e) => setNaziv(e.target.value)}
                                        placeholder="Npr. Nestanak vode u trećem bloku"
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
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>
                                        Tekst obaveštenja:
                                    </label>
                                    <textarea
                                        value={tekst}
                                        onChange={(e) => setTekst(e.target.value)}
                                        placeholder="Unesite detalje obaveštenja za studente..."
                                        rows="5"
                                        style={{
                                            width: '100%',
                                            padding: '10px 15px',
                                            borderRadius: '6px',
                                            border: '1px solid #ccc',
                                            boxSizing: 'border-box',
                                            fontSize: 'clamp(12.5px, 1.1vw, 14px)',
                                            resize: 'vertical',
                                            fontFamily: 'Arial, sans-serif'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            padding: '12px 25px',
                                            backgroundColor: loading ? '#ccc' : '#28a745',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '15px',
                                            fontWeight: 'bold',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            transition: 'background-color 0.2s',
                                            height: '42px'
                                        }}
                                    >
                                        {loading ? 'Objavljivanje...' : 'Objavi obaveštenje'}
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

                <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0 35px 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', position: 'relative' }}>
                    <h2 style={{ color: '#333', margin: 0, textAlign: 'left' }}>
                        Prethodno objavljeno
                    </h2>
                </div>

                {mojeObjave.length === 0 ? (
                    <p style={{ color: '#777', fontStyle: 'italic', fontSize: 'clamp(13px, 1.2vw, 14.5px)' }}>Nema prethodnih objava.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: sirinaEkrana > 1200 ? 'repeat(3, 1fr)' : sirinaEkrana > 768 ? 'repeat(2, 1fr)' : '1fr',
                        gap: '20px',
                        width: '100%',
                        boxSizing: 'border-box',
                        marginBottom: '20px'
                    }}>
                        {mojeObjave.map((objava) => {
                            const trenId = objava.id || objava.Id;
                            const trenNaziv = objava.naziv || objava.Naziv;
                            const trenTekst = objava.tekst || objava.Tekst;
                            const trenDatum = objava.datum || objava.Datum;

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
                                        boxSizing: 'border-box',
                                        minHeight: '200px' 
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px dashed #eee', paddingBottom: '10px', flexWrap: 'wrap', gap: '5px' }}>
                                            <strong style={{ color: '#007bff', fontSize: 'clamp(13.5px, 1.2vw, 15px)' }}>{trenNaziv}</strong>
                                            <span style={{ fontSize: 'clamp(11px, 1vw, 12.5px)', color: '#888', fontWeight: 'bold' }}>{formatirajDatum(trenDatum)}</span>
                                        </div>
                                        <p style={{ color: '#333', margin: '0 0 20px 0', fontSize: 'clamp(12.5px, 1.1vw, 14px)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{trenTekst}</p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f5f5f5', paddingTop: '12px' }}>
                                        <button
                                            onClick={() => setObavestenjeZaBrisanje(trenId)}
                                            style={{
                                                backgroundColor: '#fff',
                                                color: '#dc3545',
                                                border: '1px solid #dc3545',
                                                borderRadius: '4px',
                                                padding: '6px 12px',
                                                fontSize: '12.5px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#dc3545';
                                                e.currentTarget.style.color = '#fff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#fff';
                                                e.currentTarget.style.color = '#dc3545';
                                            }}
                                        >
                                            Obriši
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {obavestenjeZaBrisanje && (
                <div
                    onClick={() => setObavestenjeZaBrisanje(null)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1400, padding: '20px 10px' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', padding: '30px 25px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px', textAlign: 'center', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <h3 style={{ color: '#dc3545', marginTop: 0, marginBottom: '15px' }}>Potvrda brisanja</h3>
                        <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.5', marginBottom: '25px', fontWeight: 'bold' }}>
                            Da li ste sigurni da želite da obrišete ovo obaveštenje?
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setObavestenjeZaBrisanje(null)}
                                style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Odustani
                            </button>
                            <button
                                onClick={() => handleBrisanje(obavestenjeZaBrisanje)}
                                style={{ flex: 1, padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Da, obriši
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UpravnikPocetna;
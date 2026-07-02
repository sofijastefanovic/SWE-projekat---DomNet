import React, { useState, useEffect } from 'react';
import StudentMeni from './StudentMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const StudentProfil = () => {
    const [podaci, setPodaci] = useState(null);
    const [poruka, setPoruka] = useState('');
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

    const [trenutnaSifra, setTrenutnaSifra] = useState('');
    const [novaSifra, setNovaSifra] = useState('');
    const [potvrdaSifre, setPotvrdaSifre] = useState('');
    const [profilPoruka, setProfilPoruka] = useState('');

    useEffect(() => {
        const handleResize = () => setSirinaEkrana(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const ucitajProfil = async () => {
            try {
                const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
                if (!sacuvaniKorisnik) return;

                const korisnik = JSON.parse(sacuvaniKorisnik);

                const studentId = korisnik.studentId || korisnik.id;
                const response = await fetch(`${konfiguracija.baseURL}/api/studenti/${studentId}`);

                if (response.ok) {
                    const studentBaza = await response.json();

                    setPodaci({
                        ...studentBaza,
                        korisnikId: korisnik.id,
                        studentId: korisnik.studentId,
                        ime: korisnik.ime,
                        email: korisnik.email
                    });
                } else {
                    setPoruka('Greška pri učitavanju profila.');
                }
            } catch (error) {
                console.error(error);
                setPoruka('Nije moguće uspostaviti vezu sa serverom.');
            }
        };

        ucitajProfil();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (profilPoruka) {
            const tajmer = setTimeout(() => {
                setProfilPoruka('');
            }, 4000);
            return () => clearTimeout(tajmer);
        }
    }, [profilPoruka]);

    const handlePromeniSifru = async (e) => {
        e.preventDefault();
        setProfilPoruka('');

        if (!podaci?.id) {
            setProfilPoruka('Greška: ID korisnika nije učitan.');
            return;
        }

        const trenutnaTrim = trenutnaSifra.trim();
        const novaTrim = novaSifra.trim();
        const potvrdaTrim = potvrdaSifre.trim();

        if (novaTrim !== potvrdaTrim) {
            setProfilPoruka('Greška: Nova šifra i potvrda šifre se ne poklapaju.');
            return;
        }
        if (novaTrim.length < 4) {
            setProfilPoruka('Greška: Nova šifra mora imati barem 4 karaktera.');
            return;
        }

        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/profil/promeni-sifru`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    korisnikId: podaci.korisnikId,
                    trenutnaSifra: trenutnaTrim,
                    novaSifra: novaTrim
                })
            });

            if (response.ok) {
                setProfilPoruka('Lozinka je uspešno promenjena!');
                setTrenutnaSifra('');
                setNovaSifra('');
                setPotvrdaSifre('');
            } else {
                const errorText = await response.text();
                setProfilPoruka(`Greška: ${errorText || 'Neuspešna promena šifre.'}`);
            }
        } catch (error) {
            setProfilPoruka('Greška pri komunikaciji sa serverom.');
        }
    };

    const formatirajDatum = (datumString) => {
        if (!datumString) return 'Nije evidentirano';
        const d = new Date(datumString);
        return d.toLocaleDateString('sr-RS');
    };

    const jeMaliEkran = sirinaEkrana <= 600;

    const stilReda = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
        padding: '12px 0',
        borderBottom: '1px solid #eee',
        fontSize: '14.5px'
    };

    const formatiranoIme = podaci?.ime ? podaci.ime.replace(/([a-z])([A-Z])/g, '$1 $2') : '';
    const deloviImena = formatiranoIme.split(' ');
    const ime = deloviImena[0] || '';
    const prezime = deloviImena.slice(1).join(' ') || '-';

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            margin: 0,
            padding: jeMaliEkran ? '20px 12px' : '30px',
            backgroundColor: '#f9f9f9',
            boxSizing: 'border-box',
            fontFamily: 'Arial, sans-serif'
        }}>
            <StudentMeni />

            <div style={{ width: '100%', boxSizing: 'border-box' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', position: 'relative' }}>
                    <h2 style={{ color: '#333', margin: 0, textAlign: 'left' }}>
                        Profil i promena lozinke
                    </h2>
                </div>

                {poruka && (
                    <p style={{ color: 'red', textAlign: 'center', backgroundColor: '#fce8e6', padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px' }}>
                        {poruka}
                    </p>
                )}

                {!podaci && !poruka ? (
                    <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', fontSize: '14.5px' }}>Učitavanje podataka...</p>
                ) : podaci ? (
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: sirinaEkrana > 1100 ? 'repeat(3, 1fr)' : sirinaEkrana > 768 ? 'repeat(2, 1fr)' : '1fr',
                        gap: '20px',
                        width: '100%',
                        boxSizing: 'border-box',
                        marginBottom: '30px'
                    }}>
                        
                        {/* Osnovni podaci */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '25px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                            border: '1px solid #eee',
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box'
                        }}>
                            <h4 style={{ color: '#007bff', marginTop: 0, borderBottom: '1px dashed #eee', paddingBottom: '10px', marginBottom: '15px', fontSize: 'clamp(15px, 1.4vw, 17px)', fontWeight: 'bold' }}>
                                Osnovni podaci
                            </h4>
                            <div style={stilReda}>
                                <span style={{ color: '#666', fontWeight: 'bold', flexShrink: 0 }}>Ime:</span>
                                <span style={{ color: '#333', fontWeight: 'bold', wordBreak: 'break-word', textAlign: 'right' }}>{ime}</span>
                            </div>
                            <div style={stilReda}>
                                <span style={{ color: '#666', fontWeight: 'bold', flexShrink: 0 }}>Prezime:</span>
                                <span style={{ color: '#333', fontWeight: 'bold', wordBreak: 'break-word', textAlign: 'right' }}>{prezime}</span>
                            </div>
                            <div style={stilReda}>
                                <span style={{ color: '#666', fontWeight: 'bold', flexShrink: 0 }}>Email adresa:</span>
                                <span style={{ color: '#333', wordBreak: 'break-all', textAlign: 'right' }}>{podaci.email}</span>
                            </div>
                            <div style={{ ...stilReda, borderBottom: 'none' }}>
                                <span style={{ color: '#666', fontWeight: 'bold', flexShrink: 0 }}>Broj telefona:</span>
                                <span style={{ color: '#333', wordBreak: 'break-word', textAlign: 'right' }}>{podaci.telefon}</span>
                            </div>
                        </div>

                        {/* Fakultet i dom */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '25px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                            border: '1px solid #eee',
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box'
                        }}>
                            <h4 style={{ color: '#007bff', marginTop: 0, borderBottom: '1px dashed #eee', paddingBottom: '10px', marginBottom: '15px', fontSize: 'clamp(15px, 1.4vw, 17px)', fontWeight: 'bold' }}>
                                Fakultet i dom
                            </h4>
                            <div style={stilReda}>
                                <span style={{ color: '#666', fontWeight: 'bold', flexShrink: 0 }}>Fakultet:</span>
                                <span style={{ color: '#333', textTransform: 'capitalize', wordBreak: 'break-word', textAlign: 'right' }}>{podaci.fakultet || 'Nije uneto'}</span>
                            </div>
                            <div style={stilReda}>
                                <span style={{ color: '#666', fontWeight: 'bold', flexShrink: 0 }}>Smer:</span>
                                <span style={{ color: '#333', textTransform: 'capitalize', wordBreak: 'break-word', textAlign: 'right' }}>{podaci.smer}</span>
                            </div>
                            <div style={{ ...stilReda, borderBottom: 'none' }}>
                                <span style={{ color: '#666', fontWeight: 'bold', flexShrink: 0 }}>Datum useljenja:</span>
                                <span style={{ color: '#333', wordBreak: 'break-word', textAlign: 'right' }}>{formatirajDatum(podaci.datumUseljenja || podaci.DatumUseljenja)}</span>
                            </div>
                        </div>

                        {/* Bezbednost i lozinka */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '25px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                            border: '1px solid #eee',
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box'
                        }}>
                            <h4 style={{ color: '#007bff', marginTop: 0, borderBottom: '1px dashed #eee', paddingBottom: '10px', marginBottom: '15px', fontSize: 'clamp(15px, 1.4vw, 17px)', fontWeight: 'bold' }}>
                                Bezbednost i lozinka
                            </h4>

                            {profilPoruka && (
                                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <p style={{
                                        color: (profilPoruka.toLowerCase().includes('uspešno') || profilPoruka.toLowerCase().includes('uspeh')) ? 'green' : 'red',
                                        backgroundColor: (profilPoruka.toLowerCase().includes('uspešno') || profilPoruka.toLowerCase().includes('uspeh')) ? '#e6f4ea' : '#fce8e6',
                                        padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px', width: '100%', boxSizing: 'border-box'
                                    }}>
                                        {profilPoruka}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handlePromeniSifru} style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ marginBottom: '12px' }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: 'clamp(12.5px, 1.1vw, 14px)', marginBottom: '5px', color: '#555' }}>Trenutna lozinka:</label>
                                        <input
                                            type="password"
                                            value={trenutnaSifra}
                                            onChange={(e) => setTrenutnaSifra(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: 'clamp(12.5px, 1.1vw, 14px)', height: '40px', outline: 'none' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '12px' }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: 'clamp(12.5px, 1.1vw, 14px)', marginBottom: '5px', color: '#555' }}>Nova lozinka:</label>
                                        <input
                                            type="password"
                                            value={novaSifra}
                                            onChange={(e) => setNovaSifra(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: 'clamp(12.5px, 1.1vw, 14px)', height: '40px', outline: 'none' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: 'clamp(12.5px, 1.1vw, 14px)', marginBottom: '5px', color: '#555' }}>Potvrdite novu lozinku:</label>
                                        <input
                                            type="password"
                                            value={potvrdaSifre}
                                            onChange={(e) => setPotvrdaSifre(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: 'clamp(12.5px, 1.1vw, 14px)', height: '40px', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        padding: '10px 25px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        height: '42px',
                                        alignSelf: 'flex-start',
                                        width: jeMaliEkran ? '100%' : 'auto'
                                    }}
                                >
                                    Promeni lozinku
                                </button>
                            </form>
                        </div>

                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default StudentProfil;
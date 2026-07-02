import React, { useState, useEffect } from 'react';
import PortirMeni from './PortirMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const PortirProfil = () => {
    const [podaci, setPodaci] = useState(null);
    const [poruka, setPoruka] = useState('');
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

    
    const [trenutnaSifra, setTrenutnaSifra] = useState('');
    const [novaSifra, setNovaSifra] = useState('');
    const [potvrdaSifre, setPotvrdaSifre] = useState('');
    const [profilPoruka, setProfilPoruka] = useState('');
    const [isGreska, setIsGreska] = useState(false);

    useEffect(() => {
        const handleResize = () => setSirinaEkrana(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const ucitajProfil = async () => {
            try {
                const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
                if (!sacuvaniKorisnik) return;

                const korisnik = JSON.parse(sacuvaniKorisnik);
                const korisnikId = korisnik.id;

                const response = await fetch(`${konfiguracija.baseURL}/api/profil/portir/${korisnikId}`);

                if (response.ok) {
                    const portirBaza = await response.json();
                    setPodaci({
                        ...portirBaza,
                        korisnikId: korisnik.id,
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

    const handlePromeniSifru = async (e) => {
        e.preventDefault();
        setProfilPoruka('');
        setIsGreska(false);

        if (!podaci?.korisnikId) {
            setProfilPoruka('Greška: ID korisnika nije učitan.');
            setIsGreska(true);
            return;
        }

        const trenutnaTrim = trenutnaSifra.trim();
        const novaTrim = novaSifra.trim();
        const potvrdaTrim = potvrdaSifre.trim();

        if (novaTrim !== potvrdaTrim) {
            setProfilPoruka('Nova šifra i potvrda šifre se ne poklapaju.');
            setIsGreska(true);
            return;
        }
        if (novaTrim.length < 4) {
            setProfilPoruka('Nova šifra mora imati barem 4 karaktera.');
            setIsGreska(true);
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
                setProfilPoruka('Šifra je uspešno promenjena!');
                setIsGreska(false);
                setTrenutnaSifra('');
                setNovaSifra('');
                setPotvrdaSifre('');
            } else {
                const errorText = await response.text();
                setProfilPoruka(`❌ ${errorText}`);
                setIsGreska(true);
            }
        } catch (error) {
            setProfilPoruka('Greška pri komunikaciji sa serverom.');
            setIsGreska(true);
        }
    };

    const jeMaliEkran = sirinaEkrana <= 600;

    return (
        <div style={{ padding: jeMaliEkran ? '20px 15px' : '30px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <PortirMeni />

            <div style={{ maxWidth: '900px', margin: '40px auto' }}>
                {poruka && <p style={{ color: 'red', textAlign: 'center' }}>{poruka}</p>}

                {podaci && (
                    <>
                        {}
                        <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                            <h3 style={{ color: '#007bff', marginTop: 0 }}>Podaci o portiru</h3>
                            <p><strong>Ime:</strong> {podaci.ime}</p>
                            <p><strong>Email:</strong> {podaci.email}</p>
                            <p><strong>Telefon:</strong> {podaci.telefon}</p>
                            <p><strong>JMBG:</strong> {podaci.jmbg}</p>
                        </div>

                        {}
                        <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ color: '#dc3545', marginTop: 0 }}>Promena lozinke</h3>
                            {profilPoruka && (
                                <p style={{ color: isGreska ? 'red' : 'green', fontWeight: 'bold' }}>{profilPoruka}</p>
                            )}
                            <form onSubmit={handlePromeniSifru} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <input type="password" placeholder="Trenutna lozinka" value={trenutnaSifra} onChange={(e) => setTrenutnaSifra(e.target.value)} required />
                                <input type="password" placeholder="Nova lozinka" value={novaSifra} onChange={(e) => setNovaSifra(e.target.value)} required />
                                <input type="password" placeholder="Potvrdi novu lozinku" value={potvrdaSifre} onChange={(e) => setPotvrdaSifre(e.target.value)} required />
                                <button type="submit" style={{ padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px' }}>
                                    Promeni lozinku
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PortirProfil;
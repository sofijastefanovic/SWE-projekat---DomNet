import React, { useState, useEffect } from 'react';
import konfiguracija from '../konfiguracija.js';
import { useNavigate } from 'react-router-dom';

const AdminPocetna = () => {
    const navigate = useNavigate();
    const [korisnici, setKorisnici] = useState([]);
    const [filteredKorisnici, setFilteredKorisnici] = useState([]);
    const [loading, setLoading] = useState(true);
    const [poruka, setPoruka] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTip, setFilterTip] = useState('svi');

    
    const [editKorisnikId, setEditKorisnikId] = useState(null);

    
    const [stats, setStats] = useState({
        ukupno: 0,
        studenti: 0,
        portiri: 0,
        majstori: 0,
        upravnici: 0
    });

    
    const [ime, setIme] = useState('');
    const [email, setEmail] = useState('');
    const [sifra, setSifra] = useState('');
    const [tip, setTip] = useState('student');

    const [jmbg, setJmbg] = useState('');
    const [telefon, setTelefon] = useState('');
    const [brIndexa, setBrIndexa] = useState('');
    const [brSobe, setBrSobe] = useState('');
    const [fakultet, setFakultet] = useState('');
    const [smer, setSmer] = useState('');
    const [datumUseljenja, setDatumUseljenja] = useState('');

    useEffect(() => {
        fetchKorisnike();
    }, []);

    const fetchKorisnike = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/admin/korisnici`);
            if (response.ok) {
                const podaci = await response.json();
                setKorisnici(podaci);
                setFilteredKorisnici(podaci);

                const statistika = {
                    ukupno: podaci.length,
                    studenti: podaci.filter(k => k.tip === 'student').length,
                    portiri: podaci.filter(k => k.tip === 'portir').length,
                    majstori: podaci.filter(k => k.tip === 'majstor').length,
                    upravnici: podaci.filter(k => k.tip === 'upravnik').length,
                };
                setStats(statistika);
            }
        } catch (error) {
            setPoruka('Greška pri učitavanju korisnika.');
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        let rezultat = [...korisnici];

        if (searchTerm.trim()) {
            const upit = searchTerm.toLowerCase().trim();
            rezultat = rezultat.filter(k =>
                (k.ime && k.ime.toLowerCase().includes(upit)) ||
                (k.email && k.email.toLowerCase().includes(upit))
            );
        }

        if (filterTip !== 'svi') {
            rezultat = rezultat.filter(k => k.tip === filterTip);
        }

        setFilteredKorisnici(rezultat);
    }, [searchTerm, filterTip, korisnici]);

    const pokreniIzmenu = (k) => {
        setEditKorisnikId(k.id);
        setIme(k.ime || '');
        setEmail(k.email || '');
        setTip(k.tip || 'student');
        setSifra('********');
        setTelefon(k.telefon || '');
        setBrIndexa(k.brIndexa || '');
        setBrSobe(k.brSobe || '');
        setFakultet(k.fakultet || '');
        setSmer(k.smer || '');
        setJmbg(k.jmbg || '');
        setDatumUseljenja(k.datumUseljenja ? k.datumUseljenja.split('T')[0] : '');

        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const ponistiFormu = () => {
        setEditKorisnikId(null);
        setIme(''); setEmail(''); setSifra('');
        setJmbg(''); setTelefon(''); setBrIndexa(''); setBrSobe('');
        setFakultet(''); setSmer(''); setDatumUseljenja('');
    };

    const handleSpremiPodatke = async (e) => {
        e.preventDefault();

        if (editKorisnikId) {
           
            const izmenjenKorisnik = {
                ime: ime.trim(),
                email: email.trim(),
                telefon: telefon.trim() || null,
                brSobe: brSobe ? parseInt(brSobe) : null,
                brIndexa: brIndexa.trim() || null,
                fakultet: fakultet.trim() || null,
                smer: smer.trim() || null
            };

            try {
                const response = await fetch(`${konfiguracija.baseURL}/api/admin/korisnik/${editKorisnikId}/izmeni`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(izmenjenKorisnik)
                });

                if (response.ok) {
                    setPoruka('Podaci korisnika su uspešno ažurirani!');
                    setIsSuccess(true);
                    ponistiFormu();
                    fetchKorisnike();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const errorText = await response.text();
                    setPoruka(`❌ ${errorText}`);
                    setIsSuccess(false);
                }
            } catch (error) {
                setPoruka('Greška pri komunikaciji sa serverom.');
                setIsSuccess(false);
            }
        } else {
            
            if (!ime || !email || !sifra) {
                setPoruka('Ime, email i šifra su obavezni!');
                setIsSuccess(false);
                return;
            }

            const noviKorisnik = {
                ime: ime.trim(),
                email: email.trim(),
                sifra: sifra.trim(),
                tip: tip,
                jmbg: jmbg.trim() || null,
                telefon: telefon.trim() || null,
                brIndexa: brIndexa.trim() || null,
                brSobe: brSobe ? parseInt(brSobe) : null,
                fakultet: fakultet.trim() || null,
                smer: smer.trim() || null,
                datumUseljenja: datumUseljenja || null
            };

            try {
                const response = await fetch(`${konfiguracija.baseURL}/api/admin/kreiraj`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noviKorisnik)
                });

                if (response.ok) {
                    setPoruka('✅ Korisnik uspešno kreiran!');
                    setIsSuccess(true);
                    ponistiFormu();
                    fetchKorisnike();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const errorText = await response.text();
                    setPoruka(`❌ ${errorText}`);
                    setIsSuccess(false);
                }
            } catch (error) {
                setPoruka('Greška pri komunikaciji sa serverom.');
                setIsSuccess(false);
            }
        }
    };

    const handleObrisiKorisnika = async (id) => {
        if (!window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) return;
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/admin/korisnik/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setPoruka('Korisnik je uspešno obrisan.');
                setIsSuccess(true);
                fetchKorisnike();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            setPoruka('Greška pri brisanju.');
            setIsSuccess(false);
        }
    };

    const handleResetujSifru = async (id, imeKorisnika) => {
        if (!window.confirm(`Resetovati šifru za korisnika ${imeKorisnika}?`)) return;
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/admin/korisnik/${id}/reset-sifre`, { method: 'PUT' });
            if (response.ok) {
                const data = await response.json();
                setPoruka(data.message);
                setIsSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setPoruka('Greška pri resetovanju šifre.');
                setIsSuccess(false);
            }
        } catch (error) {
            setPoruka('Greška pri resetovanju šifre.');
            setIsSuccess(false);
        }
    };

    
    const inputStil = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '15px',
        boxSizing: 'border-box',
        backgroundColor: '#fff'
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', padding: '30px', backgroundColor: '#f9f9f9', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px 30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#333', fontSize: '26px' }}>Administracija • DomNet</h1>
                <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ padding: '12px 24px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Odjavi se
                </button>
            </div>

            {poruka && (
                <div style={{
                    padding: '14px 20px',
                    marginBottom: '25px',
                    borderRadius: '6px',
                    backgroundColor: isSuccess ? '#e6f4ea' : '#fce8e6',
                    color: isSuccess ? 'green' : 'red',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {poruka}
                </div>
            )}

            {}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ backgroundColor: 'white', padding: '22px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <h4>Ukupno korisnika</h4>
                    <h1 style={{ margin: '8px 0 0 0', fontSize: '38px', color: '#1a237e' }}>{stats.ukupno}</h1>
                </div>
                <div style={{ backgroundColor: 'white', padding: '22px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <h4 style={{ color: '#28a745' }}>Studenti</h4>
                    <h1 style={{ margin: '8px 0 0 0', fontSize: '38px', color: '#28a745' }}>{stats.studenti}</h1>
                </div>
                <div style={{ backgroundColor: 'white', padding: '22px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <h4 style={{ color: '#fd7e14' }}>Portiri</h4>
                    <h1 style={{ margin: '8px 0 0 0', fontSize: '38px', color: '#fd7e14' }}>{stats.portiri}</h1>
                </div>
                <div style={{ backgroundColor: 'white', padding: '22px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <h4 style={{ color: '#007bff' }}>Majstori</h4>
                    <h1 style={{ margin: '8px 0 0 0', fontSize: '38px', color: '#007bff' }}>{stats.majstori}</h1>
                </div>
                <div style={{ backgroundColor: 'white', padding: '22px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <h4 style={{ color: '#6f42c1' }}>Upravnici</h4>
                    <h1 style={{ margin: '8px 0 0 0', fontSize: '38px', color: '#6f42c1' }}>{stats.upravnici}</h1>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                {}
                <div style={{ flex: '1', minWidth: '380px', backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#007bff', marginTop: 0, marginBottom: '20px' }}>
                        {editKorisnikId ? 'Izmeni podatke korisnika' : 'Kreiraj novog korisnika'}
                    </h3>

                    <form onSubmit={handleSpremiPodatke} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="text" placeholder="Ime i prezime *" value={ime} onChange={(e) => setIme(e.target.value)} required style={inputStil} />
                        <input type="email" placeholder="Email adresa *" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStil} />

                        {!editKorisnikId && (
                            <input type="password" placeholder="Lozinka *" value={sifra} onChange={(e) => setSifra(e.target.value)} required style={inputStil} />
                        )}

                        <select value={tip} onChange={(e) => setTip(e.target.value)} disabled={!!editKorisnikId} style={{ ...inputStil, height: '46px' }}>
                            <option value="student">Student</option>
                            <option value="portir">Portir</option>
                            <option value="majstor">Majstor</option>
                            <option value="upravnik">Upravnik</option>
                        </select>

                        {tip === 'student' && (
                            <>
                                <input type="text" placeholder="JMBG" value={jmbg} onChange={(e) => setJmbg(e.target.value)} style={inputStil} />
                                <input type="text" placeholder="Broj telefona" value={telefon} onChange={(e) => setTelefon(e.target.value)} style={inputStil} />
                                <input type="text" placeholder="Broj indeksa" value={brIndexa} onChange={(e) => setBrIndexa(e.target.value)} style={inputStil} />
                                <input type="number" placeholder="Broj sobe" value={brSobe} onChange={(e) => setBrSobe(e.target.value)} style={inputStil} />
                                <input type="text" placeholder="Fakultet" value={fakultet} onChange={(e) => setFakultet(e.target.value)} style={inputStil} />
                                <input type="text" placeholder="Smer" value={smer} onChange={(e) => setSmer(e.target.value)} style={inputStil} />
                                {!editKorisnikId && <input type="date" value={datumUseljenja} onChange={(e) => setDatumUseljenja(e.target.value)} style={inputStil} />}
                            </>
                        )}

                        {}
                        {tip !== 'student' && (
                            <>
                                <input type="text" placeholder="Broj telefona" value={telefon} onChange={(e) => setTelefon(e.target.value)} style={inputStil} />
                                {!editKorisnikId && <input type="text" placeholder="JMBG" value={jmbg} onChange={(e) => setJmbg(e.target.value)} style={inputStil} />}
                            </>
                        )}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" style={{ flex: 1, padding: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                {editKorisnikId ? 'Sačuvaj izmene' : 'Kreiraj korisnika'}
                            </button>
                            {editKorisnikId && (
                                <button type="button" onClick={ponistiFormu} style={{ padding: '14px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Poništi
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {}
                <div style={{ flex: '2', minWidth: '550px', backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <h3 style={{ margin: 0 }}>Svi korisnici ({filteredKorisnici.length})</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Pretraži po imenu ili emailu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ padding: '10px 14px', width: '260px', borderRadius: '6px', border: '1px solid #ccc' }}
                            />
                            <select value={filterTip} onChange={(e) => setFilterTip(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                                <option value="svi">Sve uloge</option>
                                <option value="student">Studenti</option>
                                <option value="portir">Portiri</option>
                                <option value="majstor">Majstori</option>
                                <option value="upravnik">Upravnici</option>
                            </select>
                        </div>
                    </div>

                    {loading ? <p>Učitavanje...</p> : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                                        <th style={{ padding: '14px', textAlign: 'left' }}>Ime</th>
                                        <th style={{ padding: '14px', textAlign: 'left' }}>Email</th>
                                        <th style={{ padding: '14px' }}>Uloga</th>
                                        <th style={{ padding: '14px', textAlign: 'center' }}>Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredKorisnici.map(k => (
                                        <tr key={k.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '14px' }}>{k.ime}</td>
                                            <td style={{ padding: '14px' }}>{k.email}</td>
                                            <td style={{ padding: '14px' }}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '20px', fontSize: '13px', color: 'white',
                                                    backgroundColor: k.tip === 'student' ? '#28a745' : k.tip === 'portir' ? '#fd7e14' : '#007bff'
                                                }}>
                                                    {k.tip}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px', textAlign: 'center' }}>
                                                <button onClick={() => pokreniIzmenu(k)} style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                                    Izmeni
                                                </button>
                                                <button onClick={() => handleResetujSifru(k.id, k.ime)} style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                                    Reset šifre
                                                </button>
                                                <button onClick={() => handleObrisiKorisnika(k.id)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                                    Obriši
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPocetna;
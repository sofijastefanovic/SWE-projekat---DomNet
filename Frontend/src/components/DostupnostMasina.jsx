import React, { useState, useEffect, useCallback } from 'react';
import StudentMeni from './StudentMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const DostupnostMasina = () => {
    const [masine, setMasine] = useState([]);
    const [mojeRezervacije, setMojeRezervacije] = useState([]);
    const [selectedMasina, setSelectedMasina] = useState(null);
    const [selectedMasinaNaziv, setSelectedMasinaNaziv] = useState('');
    const [selectedDatum, setSelectedDatum] = useState('');
    const [termini, setTermini] = useState([]);
    const [loading, setLoading] = useState(true);

    const [poruka, setPoruka] = useState('');
    const [otvorenModal, setOtvorenModal] = useState(false);
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);
    const [prikaziStatusInfo, setPrikaziStatusInfo] = useState(false); 

    const trenutniKorisnik = JSON.parse(localStorage.getItem('trenutniKorisnik') || '{}');
    const studentId = trenutniKorisnik.studentId || trenutniKorisnik.id;

    const danas = new Date().toISOString().split('T')[0];
    const maxDatum = new Date();
    maxDatum.setDate(maxDatum.getDate() + 30);
    const maxDatumStr = maxDatum.toISOString().split('T')[0];

    useEffect(() => {
        const handleResize = () => setSirinaEkrana(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (poruka) {
            const tajmer = setTimeout(() => setPoruka(''), 4000);
            return () => clearTimeout(tajmer);
        }
    }, [poruka]);

    const formatirajDatumPrikaz = (datumString) => {
        if (!datumString) return '';
        const cistiDatum = datumString.split('T')[0];
        const delovi = cistiDatum.split('-');
        if (delovi.length !== 3) return datumString;
        return `${delovi[2]}.${delovi[1]}.${delovi[0]}.`;
    };

    const formatirajTerminPrikaz = (zahtev) => {
        if (zahtev.vremeOd && zahtev.vremeDo) {
            return `${zahtev.vremeOd} - ${zahtev.vremeDo}`;
        }

        if (zahtev.vremenskiSlot?.vremeOd && zahtev.vremenskiSlot?.vremeDo) {
            return `${zahtev.vremenskiSlot.vremeOd} - ${zahtev.vremenskiSlot.vremeDo}`;
        }

        const satniceIzBekenda = {
            1: '06:00 - 09:00',
            2: '09:30 - 12:30',
            3: '13:00 - 16:00',
            4: '16:30 - 19:30',
            5: '20:00 - 23:00'
        };

        return satniceIzBekenda[zahtev.slot] || `Slot ${zahtev.slot}`;
    };

    const fetchMasine = useCallback(async () => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/vesmasine?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                setMasine(data);
            }
        } catch (error) {
            setPoruka('Greška pri učitavanju mašina.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMojeRezervacije = useCallback(async () => {
        if (!studentId) return;
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/vesmasine/moje-rezervacije/${studentId}?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                setMojeRezervacije(data);
            }
        } catch (error) {
            console.error("Greška pri učitavanju mojih rezervacija");
        }
    }, [studentId]);

    const ucitajTermine = useCallback(async (masinaId, naziv, datum) => {
        if (!datum || !masinaId) return;
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/vesmasine/termini/${masinaId}/${datum}?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                setTermini(data);
            }
        } catch (error) {
            setPoruka('Greška pri učitavanju termina.');
        }
    }, []);

    useEffect(() => {
        fetchMasine();
        fetchMojeRezervacije();

        const interval = setInterval(() => {
            fetchMasine();
            fetchMojeRezervacije();
            if (otvorenModal && selectedMasina && selectedDatum) {
                ucitajTermine(selectedMasina, selectedMasinaNaziv, selectedDatum);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchMasine, fetchMojeRezervacije, ucitajTermine, otvorenModal, selectedMasina, selectedMasinaNaziv, selectedDatum]);

    const posaljiZahtev = async (slot) => {
        if (!selectedMasina || !selectedDatum) return;
        setPoruka('');

        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/vesmasine/rezervisi`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: studentId,
                    masinaId: selectedMasina,
                    datum: selectedDatum,
                    slot: slot
                })
            });

            if (response.ok) {
                setPoruka('Zahtev je uspešno poslat portiru!');
                ucitajTermine(selectedMasina, selectedMasinaNaziv, selectedDatum);
                fetchMojeRezervacije();
                zatvoriModal();
            } else {
                const errorText = await response.text();
                setPoruka('Greška: ' + errorText);
                zatvoriModal();
            }
        } catch (error) {
            setPoruka('Nije moguće poslati zahtev.');
            zatvoriModal();
        }
    };

    const zatvoriModal = () => {
        setOtvorenModal(false);
        setSelectedMasina(null);
        setSelectedMasinaNaziv('');
        setSelectedDatum('');
        setTermini([]);
    };

    if (loading) return <div style={{ padding: '30px' }}><StudentMeni /><p>Učitavanje...</p></div>;

    const jeMaliEkran = sirinaEkrana <= 600;

    return (
        <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: jeMaliEkran ? '20px 12px' : '30px', backgroundColor: '#f9f9f9', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }}>
            <StudentMeni />

            {poruka && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p style={{
                        color: (poruka.includes('uspešno') || poruka.includes('odobren')) ? 'green' : 'red',
                        backgroundColor: (poruka.includes('uspešno') || poruka.includes('odobren')) ? '#e6f4ea' : '#fce8e6',
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

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <button
                    onClick={() => {
                        setPoruka('');
                        setSelectedMasina(null);
                        setSelectedMasinaNaziv('');
                        setSelectedDatum('');
                        setTermini([]);
                        setOtvorenModal(true);
                    }}
                    style={{
                        padding: '14px 28px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,123,255,0.15)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Zakaži termin
                </button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0 35px 0' }} />

            <div style={{ marginBottom: '35px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', position: 'relative' }}>
                    <h2 style={{ color: '#333', margin: 0, textAlign: 'left', fontSize: jeMaliEkran ? '20px' : '24px' }}>
                        Istorija rezervacija veš mašina
                    </h2>

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
                                right: jeMaliEkran ? '-10px' : 'auto', 
                                left: jeMaliEkran ? 'auto' : '0px',
                                width: jeMaliEkran ? '240px' : '280px',
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
                                <strong style={{ display: 'block', marginBottom: '6px', borderBottom: '1px solid #555', paddingBottom: '4px', color: '#007bff' }}>Značenje statusa rezervacije:</strong>
                                • <span style={{ color: '#fd7e14', fontWeight: 'bold' }}>NA ČEKANJU:</span> Zahtev je poslat i čeka odobrenje portira.<br />
                                • <span style={{ color: 'green', fontWeight: 'bold' }}>ODOBRENO:</span> Portir je odobrio termin.<br />
                                • <span style={{ color: 'red', fontWeight: 'bold' }}>ODBIJENO:</span> Zahtev je odbijen (npr. mašina je u kvaru).
                                
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-5px',
                                    right: jeMaliEkran ? '16px' : 'auto', 
                                    left: jeMaliEkran ? 'auto' : '10px',
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

                {mojeRezervacije.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>Nemate prethodnih rezervacija.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: sirinaEkrana > 1200
                            ? 'repeat(4, 1fr)'
                            : sirinaEkrana > 900
                                ? 'repeat(3, 1fr)'
                                : sirinaEkrana > 600
                                    ? 'repeat(2, 1fr)'
                                    : '1fr',
                        gap: '20px'
                    }}>
                        {mojeRezervacije.map(r => (
                            <div key={r.id} style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                border: '1px solid #eee',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxSizing: 'border-box'
                            }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #eee', paddingBottom: '8px' }}>
                                        <strong style={{ fontSize: '15px', color: '#007bff' }}>
                                            {formatirajDatumPrikaz(r.datum)} ({formatirajTerminPrikaz(r)})
                                        </strong>
                                    </div>

                                    <p style={{ margin: '5px 0', fontSize: '14.5px', color: '#333' }}>
                                        {r.vesMasina?.naziv}
                                    </p>
                                </div>

                                <div style={{ marginTop: '12px', fontSize: '14px' }}>
                                    <strong>Status:</strong>{' '}
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: r.status === 'odobreno' ? 'green' : r.status === 'odbijeno' ? 'red' : '#fd7e14',
                                        textTransform: 'uppercase'
                                    }}>
                                        {r.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {otvorenModal && (
                <div
                    onClick={zatvoriModal}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300, padding: '20px' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', padding: '35px 25px 25px 25px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '500px', position: 'relative', textAlign: 'left', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <button
                            onClick={zatvoriModal}
                            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}
                        >
                            x
                        </button>

                        {!selectedMasina ? (
                            <div>
                                <h3 style={{ color: '#007bff', marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Zakaži novi termin</h3>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', color: '#333', marginBottom: '12px', textAlign: 'center' }}>Izaberite veš mašinu:</label>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: sirinaEkrana > 400 ? '1fr 1fr' : '1fr',
                                    gap: '12px',
                                    marginTop: '10px'
                                }}>
                                    {masine.map(m => (
                                        <div
                                            key={m.id}
                                            onClick={() => {
                                                setSelectedMasina(m.id);
                                                setSelectedMasinaNaziv(m.naziv);
                                                setSelectedDatum('');
                                                setTermini([]);
                                            }}
                                            style={{
                                                padding: '15px',
                                                border: '1px solid #eee',
                                                borderRadius: '8px',
                                                backgroundColor: '#f8f9fa',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                                transition: 'all 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#007bff'; e.currentTarget.style.backgroundColor = '#e7f3ff'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                                        >
                                            <strong style={{ fontSize: '15px', color: '#333', display: 'block' }}>{m.naziv}</strong>
                                            <span style={{ color: '#666', fontSize: '12.5px' }}>{m.lokacija}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ color: '#007bff', margin: 0 }}>{selectedMasinaNaziv}</h3>
                                    <button
                                        onClick={() => { setSelectedMasina(null); setSelectedMasinaNaziv(''); setSelectedDatum(''); setTermini([]); }}
                                        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', padding: 0 }}
                                    >
                                        Promeni mašinu
                                    </button>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', color: '#333', marginBottom: '8px' }}>Izaberite datum:</label>
                                    <input
                                        type="date"
                                        value={selectedDatum}
                                        min={danas}
                                        max={maxDatumStr}
                                        onChange={(e) => {
                                            setSelectedDatum(e.target.value);
                                            ucitajTermine(selectedMasina, selectedMasinaNaziv, e.target.value);
                                        }}
                                        style={{ padding: '12px', fontSize: '15px', width: '100%', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}
                                    />
                                </div>

                                {selectedDatum && termini.length > 0 && (
                                    <div>
                                        <h4 style={{ marginBottom: '15px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Slobodni termini za {formatirajDatumPrikaz(selectedDatum)}</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {termini.map(t => {
                                                const jeSlobodan = t.status === "slobodno";
                                                const jeNaCekanju = t.status === "na cekanju";
                                                const jeOdobreno = t.status === "odobreno";

                                                return (
                                                    <div key={t.slot} style={{
                                                        padding: '12px 15px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        backgroundColor: jeOdobreno ? '#f0f0f0' : jeNaCekanju ? '#fff3cd' : 'white',
                                                        boxSizing: 'border-box'
                                                    }}>
                                                        <div>
                                                            <strong style={{ fontSize: '14.5px', color: '#222' }}>Termin {t.slot}</strong><br />
                                                            <span style={{ color: '#666', fontSize: '13.5px' }}>{t.vremeOd} - {t.vremeDo}</span>
                                                        </div>

                                                        <button
                                                            onClick={() => jeSlobodan && posaljiZahtev(t.slot)}
                                                            disabled={!jeSlobodan}
                                                            style={{
                                                                padding: '8px 16px',
                                                                backgroundColor: jeSlobodan ? '#28a745' : jeNaCekanju ? '#ffc107' : '#6c757d',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: jeSlobodan ? 'pointer' : 'not-allowed',
                                                                fontWeight: 'bold',
                                                                fontSize: '13px'
                                                            }}
                                                        >
                                                            Zakaži
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DostupnostMasina;
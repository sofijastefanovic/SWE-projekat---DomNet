import React, { useState, useEffect, useCallback } from 'react';
import PortirMeni from './PortirMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const PortirMasine = () => {
    const [zahtevi, setZahtevi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [poruka, setPoruka] = useState('');
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

    const [otvorenProzorProvere, setOtvorenProzorProvere] = useState(false);
    const [proveraMasina, setProveraMasina] = useState('');
    const [proveraSlot, setProveraSlot] = useState('');
    const [proveraDatum, setProveraDatum] = useState(new Date().toISOString().split('T')[0]);
    const [prikaziTipInfo, setPrikaziTipInfo] = useState(false); 

    const fetchZahtevi = useCallback(async () => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/vesmasine/zahtevi?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();

                const sortiraniZahtevi = data.sort((a, b) => {
                    const statusA = a.status === 'na cekanju' ? 0 : 1;
                    const statusB = b.status === 'na cekanju' ? 0 : 1;

                    if (statusA !== statusB) {
                        return statusA - statusB;
                    }

                    const vremeA = new Date(a.datumZahteva || a.DatumZahteva).getTime();
                    const vremeB = new Date(b.datumZahteva || b.DatumZahteva).getTime();
                    return vremeB - vremeA;
                });

                setZahtevi(sortiraniZahtevi);
            } else {
                setPoruka('Greška pri učitavanju zahteva.');
            }
        } catch (error) {
            console.error(error);
            setPoruka('Nije moguće povezati se sa serverom.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setSirinaEkrana(window.innerWidth);
        window.addEventListener('resize', handleResize);

        fetchZahtevi();

        const interval = setInterval(() => {
            fetchZahtevi();
        }, 3000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
        };
    }, [fetchZahtevi]);

    const obradiZahtev = async (id, akcija) => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/vesmasine/zahtev/${id}/${akcija}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                fetchZahtevi();
            } else {
                alert('Došlo je do greške pri obradi zahteva.');
            }
        } catch (error) {
            console.error(error);
            alert('Nije moguće povezati se sa serverom.');
        }
    };

    const formatirajDatum = (datumString) => {
        if (!datumString) return '';
        const cistiDatum = datumString.split('T')[0];
        const delovi = cistiDatum.split('-');
        if (delovi.length !== 3) return datumString;
        return `${delovi[2]}.${delovi[1]}.${delovi[0]}.`;
    };

    const formatirajTermin = (zahtev) => {
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

    const jeMaliEkran = sirinaEkrana <= 768;

    const brojNepotvrdjenih = zahtevi.filter(z => z.status === 'na cekanju').length;
    const jedinstveneMasine = [...new Set(zahtevi.map(z => z.vesMasina?.naziv).filter(Boolean))];

    const listaSlota = [
        { id: 1, prikaz: '06:00 - 09:00' },
        { id: 2, prikaz: '09:30 - 12:30' },
        { id: 3, prikaz: '13:00 - 16:00' },
        { id: 4, prikaz: '16:30 - 19:30' },
        { id: 5, prikaz: '20:00 - 23:00' }
    ];

    const pronadjeniZahtev = zahtevi.find(z => {
        const cistiDatumZahteva = z.datum ? z.datum.split('T')[0] : '';
        return z.vesMasina?.naziv === proveraMasina &&
            String(z.slot) === String(proveraSlot) &&
            cistiDatumZahteva === proveraDatum &&
            z.status === 'odobreno';
    });

    if (loading) return <div style={{ padding: '30px' }}><PortirMeni /><p>Učitavanje zahteva...</p></div>;

    return (
        <div style={{ width: '100%', minHeight: '100vh', padding: '30px', backgroundColor: '#f9f9f9', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', overflowX: 'hidden' }}>
            <PortirMeni />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: jeMaliEkran ? 'stretch' : 'center', marginBottom: '25px', flexWrap: 'wrap', flexDirection: jeMaliEkran ? 'column' : 'row', gap: '20px' }}>
                
                <div style={{ display: 'flex', flexDirection: jeMaliEkran ? 'column' : 'row', alignItems: jeMaliEkran ? 'flex-start' : 'center', gap: '12px' }}>
                    <h2 style={{ color: '#333', margin: 0, fontSize: jeMaliEkran ? '22px' : '28px' }}>Zahtevi za veš mašine</h2>
                    <span style={{
                        backgroundColor: brojNepotvrdjenih > 0 ? '#dc3545' : '#6c757d',
                        color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold',
                        whiteSpace: 'nowrap', display: 'inline-block'
                    }}>
                        {brojNepotvrdjenih} {brojNepotvrdjenih === 1 ? 'nepotvrđen termin' : 'nepotvrđenih termina'}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', alignSelf: jeMaliEkran ? 'flex-start' : 'center' }}>
                    <button
                        onClick={() => {
                            setProveraMasina('');
                            setProveraSlot('');
                            setProveraDatum(new Date().toISOString().split('T')[0]);
                            setOtvorenProzorProvere(true);
                        }}
                        style={{
                            padding: '12px 24px', backgroundColor: '#007bff', color: 'white',
                            border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px',
                            cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,123,255,0.15)'
                        }}
                    >
                        Proveri termin
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
                                left: jeMaliEkran ? '-90px' : 'auto',
                                right: jeMaliEkran ? 'auto' : '0px',
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
                                Klikom na dugme Proveri termin otvara se prozor za proveru termina. Nakon što izaberete datum i mašinu, sistem prikazuje  ime i prezime studenta koji je rezervisao termin.
                                
                                <div style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    left: jeMaliEkran ? '96px' : 'auto',
                                    right: jeMaliEkran ? 'auto' : '6px',
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
            </div>

            {poruka && <p style={{ color: 'red', textAlign: 'center' }}>{poruka}</p>}

            {zahtevi.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '40px' }}>
                    Trenutno nema pristiglih zahteva za rezervaciju mašina.
                </p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: jeMaliEkran ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '20px'
                }}>
                    {zahtevi.map((zahtev) => (
                        <div key={zahtev.id} style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            border: '1px solid #eee',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #eee', paddingBottom: '8px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#007bff' }}>{zahtev.vesMasina?.naziv}</span>
                                </div>

                                <p style={{ margin: '5px 0', fontSize: '14.5px' }}><strong>Student:</strong> {zahtev.student?.korisnik?.ime}</p>
                                <p style={{ margin: '5px 0', fontSize: '14.5px' }}><strong>Datum:</strong> {formatirajDatum(zahtev.datum)}</p>
                                <p style={{ margin: '5px 0', fontSize: '14.5px' }}><strong>Termin:</strong> {formatirajTermin(zahtev)}</p>

                                <div style={{ marginTop: '12px', fontSize: '14px' }}>
                                    <strong>Trenutni status:</strong>{' '}
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: zahtev.status === 'odobreno' ? 'green' : zahtev.status === 'odbijeno' ? 'red' : '#fd7e14',
                                        textTransform: 'uppercase'
                                    }}>
                                        {zahtev.status}
                                    </span>
                                </div>
                            </div>

                            {zahtev.status === 'na cekanju' && (
                                <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
                                    <button
                                        onClick={() => obradiZahtev(zahtev.id, 'odobri')}
                                        style={{
                                            flex: 1, padding: '11px', backgroundColor: '#28a745', color: 'white',
                                            border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
                                        }}
                                    >
                                        Odobri
                                    </button>
                                    <button
                                        onClick={() => obradiZahtev(zahtev.id, 'odbij')}
                                        style={{
                                            flex: 1, padding: '11px', backgroundColor: '#dc3545', color: 'white',
                                            border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
                                        }}
                                    >
                                        Odbij
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {otvorenProzorProvere && (
                <div
                    onClick={() => setOtvorenProzorProvere(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300, padding: '20px' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', padding: '35px 25px 25px 25px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '450px', position: 'relative', textAlign: 'left', boxSizing: 'border-box' }}
                    >
                        <button
                            onClick={() => setOtvorenProzorProvere(false)}
                            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}
                        >
                            x
                        </button>

                        <h3 style={{ color: '#007bff', marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Provera rezervacije</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', color: '#333', marginBottom: '6px' }}>Izaberite datum:</label>
                            <input
                                type="date"
                                value={proveraDatum}
                                onChange={(e) => setProveraDatum(e.target.value)}
                                style={{ padding: '11px', fontSize: '14.5px', width: '100%', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', color: '#333', marginBottom: '6px' }}>Izaberite veš mašinu:</label>
                            <select
                                value={proveraMasina}
                                onChange={(e) => setProveraMasina(e.target.value)}
                                style={{ padding: '11px', fontSize: '14.5px', width: '100%', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' }}
                            >
                                <option value="">-- Izaberi mašinu --</option>
                                {jedinstveneMasine.map(naziv => (
                                    <option key={naziv} value={naziv}>{naziv}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', color: '#333', marginBottom: '6px' }}>Izaberite termin:</label>
                            <select
                                value={proveraSlot}
                                onChange={(e) => setProveraSlot(e.target.value)}
                                style={{ padding: '11px', fontSize: '14.5px', width: '100%', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' }}
                            >
                                <option value="">-- Izaberi termin --</option>
                                {listaSlota.map(s => (
                                    <option key={s.id} value={s.id}>{s.prikaz}</option>
                                ))}
                            </select>
                        </div>

                        {proveraDatum && proveraMasina && proveraSlot && (
                            <div style={{ padding: '15px', borderRadius: '8px', backgroundColor: pronadjeniZahtev ? '#e7f3ff' : '#f8f9fa', border: '1px solid #eee', textAlign: 'center' }}>
                                {pronadjeniZahtev ? (
                                    <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>
                                        <strong>Student:</strong> {pronadjeniZahtev.student?.korisnik?.ime}
                                    </p>
                                ) : (
                                    <p style={{ margin: 0, color: '#dc3545', fontSize: '14.5px', fontStyle: 'italic' }}>
                                        Nema potvrđenih termina za izabranu kombinaciju.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortirMasine;
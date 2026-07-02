import React, { useState, useEffect, useCallback } from 'react';
import MajstorMeni from './MajstorMeni.jsx';
import DetaljiKvaraModal from './DetaljiKvaraModal.jsx';
import ZakaziKvarModal from './ZakaziKvarModal.jsx';
import konfiguracija from '../konfiguracija.js';

const MajstorZakazani = () => {
    const [zakazaniKvarovi, setZakazaniKvarovi] = useState([]);
    const [poruka, setPoruka] = useState('');
    const [selektovaniKvar, setSelektovaniKvar] = useState(null);
    const [brojIsteklih, setBrojIsteklih] = useState(0);
    const [istekliKvarovi, setIstekliKvarovi] = useState([]);
    const [otvorenIstekliModal, setOtvorenIstekliModal] = useState(false);
    const [kvarZaPrezakazivanje, setKvarZaPrezakazivanje] = useState(null);
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);
    const [kvarZaZavrsetak, setKvarZaZavrsetak] = useState(null);
    const [prikaziInfo, setPrikaziInfo] = useState(false); 

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

    const formatirajImePrezime = (tekst) => {
        if (!tekst) return 'Nije upisano';
        return tekst.replace(/([a-zšđčćž])([A-ZŠĐČĆŽ])/g, '$1 $2');
    };

    const ocistiVrstuKvara = (tekst) => {
        if (!tekst) return '';
        return tekst.split('(')[0].trim();
    };

    const formatirajDatum = (datumString) => {
        if (!datumString) return 'Nije urgentno';
        const d = new Date(datumString);
        return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
    };

    const fetchZakazaneKvarove = useCallback(async () => {
        try {
            const resZakazani = await fetch(`${konfiguracija.baseURL}/api/kvarovi/zakazani?t=${Date.now()}`);
            if (resZakazani.ok) {
                const podaci = await resZakazani.json();
                const samoZakazani = podaci.filter(k => (k.status || k.Status) && (k.status || k.Status).toLowerCase() === 'zakazano');
                const trenutnoVreme = new Date().getTime();
const istekli = samoZakazani.filter(k => (k.datumZakazivanja || k.DatumZakazivanja) && new Date(k.datumZakazivanja || k.DatumZakazivanja).getTime() + (2 * 60 * 60 * 1000) < trenutnoVreme);
                setIstekliKvarovi(istekli);
                setBrojIsteklih(istekli.length);
                const sortirani = samoZakazani.sort((a, b) => new Date(a.datumZakazivanja || a.DatumZakazivanja) - new Date(b.datumZakazivanja || b.DatumZakazivanja));
                setZakazaniKvarovi(sortirani);
            }
        } catch (error) {
            console.error('Greška pri učitavanju:', error);
            setPoruka('Greška: Nije moguće uspostaviti vezu sa serverom.');
        }
    }, []);

    useEffect(() => {
        fetchZakazaneKvarove();

        const interval = setInterval(() => {
            fetchZakazaneKvarove();
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchZakazaneKvarove]);

    const zavrsiPopravku = async (id) => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/azuriraj-status/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify('završeno')
            });
            if (response.ok) {
                setPoruka('Popravka je uspešno završena!');
                fetchZakazaneKvarove();
            }
        } catch (error) {
            console.error('Greška:', error);
            setPoruka('Greška: Došlo je do problema sa završavanjem popravke.');
        } finally {
            setKvarZaZavrsetak(null);
        }
    };

    const jeTelefon = sirinaEkrana <= 600;

    return (
        
        <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: '30px', backgroundColor: '#f9f9f9', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', overflowX: 'hidden' }}>
            <MajstorMeni />

            {poruka && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p style={{
                        color: (poruka.toLowerCase().includes('uspešno') || poruka.toLowerCase().includes('uspeh') || poruka.toLowerCase().includes('zakazan') || poruka.toLowerCase().includes('završena')) ? 'green' : 'red',
                        backgroundColor: (poruka.toLowerCase().includes('uspešno') || poruka.toLowerCase().includes('uspeh') || poruka.toLowerCase().includes('zakazan') || poruka.toLowerCase().includes('završena')) ? '#e6f4ea' : '#fce8e6',
                        padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', width: '100%', maxWidth: '550px', boxSizing: 'border-box'
                    }}>
                        {poruka}
                    </p>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                    <h2 style={{ color: '#333', margin: 0, fontSize: jeTelefon ? '20px' : '24px' }}>Zakazani termini</h2>
                    
                    <div 
                        onMouseEnter={() => setPrikaziInfo(true)}
                        onMouseLeave={() => setPrikaziInfo(false)}
                        onClick={() => setPrikaziInfo(!prikaziInfo)}
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

                        {prikaziInfo && (
                            <div style={{
                                position: 'absolute',
                                top: jeTelefon ? '34px' : 'auto',
                                bottom: jeTelefon ? 'auto' : '34px',
                                right: jeTelefon ? '-10px' : 'auto',
                                left: jeTelefon ? 'auto' : '0px',
                                width: jeTelefon ? '240px' : '290px',
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
                                <strong style={{ display: 'block', marginBottom: '6px', borderBottom: '1px solid #555', paddingBottom: '4px', color: '#007bff' }}>Značenje statusa na rasporedu:</strong>
                                • <span style={{ color: '#fd7e14', fontWeight: 'bold' }}>ZAKAZANO:</span> Popravka je planirana za izabrani datum i satnicu.<br />
                                • <span style={{ color: '#dc3545', fontWeight: 'bold' }}>PREKORAČENO:</span> Zakazani termin je prošao, a radni nalog još uvek nije zatvoren ili prezakazan.
                                
                                <div style={{
                                    position: 'absolute',
                                    top: jeTelefon ? '-5px' : 'auto',
                                    bottom: jeTelefon ? 'auto' : '-5px',
                                    right: jeTelefon ? '14px' : 'auto',
                                    left: jeTelefon ? 'auto' : '10px',
                                    width: '0',
                                    height: '0',
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderTop: jeTelefon ? 'none' : '6px solid #333',
                                    borderBottom: jeTelefon ? '6px solid #333' : 'none'
                                }} />
                            </div>
                        )}
                    </div>
                </div>

                <span
                    onClick={() => brojIsteklih > 0 && setOtvorenIstekliModal(true)}
                    style={{
                        backgroundColor: brojIsteklih > 0 ? '#dc3545' : '#6c757d',
                        color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px',
                        cursor: brojIsteklih > 0 ? 'pointer' : 'default', transition: 'transform 0.2s ease', display: 'inline-block'
                    }}
                    title={brojIsteklih > 0 ? "Klikni da vidiš kašnjenja" : ""}
                >
                    {brojIsteklih > 0 ? `${brojIsteklih} prekoračenih termina` : '0 prekoračenih termina'}
                </span>
            </div>

            {zakazaniKvarovi.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>Nemate predstojećih zakazanih popravki.</p>
            ) : (
                <ul style={{
                    listStyleType: 'none', padding: 0, margin: 0, display: 'grid',
                    gridTemplateColumns: sirinaEkrana > 1200 ? 'repeat(4, 1fr)' : sirinaEkrana > 900 ? 'repeat(3, 1fr)' : sirinaEkrana > 600 ? 'repeat(2, 1fr)' : '1fr', gap: '20px'
                }}>
                    {zakazaniKvarovi.map((kvar) => {
                        const datum = new Date(kvar.datumZakazivanja || kvar.DatumZakazivanja);
                        const trenutnoVreme = new Date().getTime();
                        const jePrekoracen = datum.getTime() + (2 * 60 * 60 * 1000) < trenutnoVreme;

                        return (
                            <li
                                key={kvar.id || kvar.Id}
                                onClick={() => setSelektovaniKvar(kvar)}
                                style={{
                                    backgroundColor: jePrekoracen ? '#fff8f8' : 'white',
                                    border: jePrekoracen ? '1px solid #f8d7da' : '1px solid #eee',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.15s ease',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #eee', paddingBottom: '8px' }}>
                                        <strong style={{ fontSize: '15px', color: '#007bff' }}>
                                            {ocistiVrstuKvara(kvar.vrstaKvara || kvar.VrstaKvara)}
                                        </strong>
                                    </div>

                                    <p style={{ margin: '5px 0', fontSize: '14.5px', color: '#333' }}>
                                        <strong>Termin:</strong> {datum.toLocaleDateString('sr-RS')} u {datum.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}h
                                    </p>
                                    <p style={{ margin: '5px 0', fontSize: '14.5px', color: '#333' }}><strong>Prijavio:</strong> {formatirajImePrezime(kvar.imePrezime || kvar.ImePrezime)}</p>
                                    <p style={{ margin: '5px 0 15px 0', fontSize: '14.5px', color: '#333' }}><strong>Lokacija:</strong> Soba {kvar.lokacija || kvar.Lokacija}</p>
                                </div>

                                <div style={{ marginTop: '12px', fontSize: '14px' }}>
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong>Status:</strong>{' '}
                                        <span style={{ fontWeight: 'bold', color: jePrekoracen ? '#dc3545' : '#fd7e14', textTransform: 'uppercase' }}>
                                            {jePrekoracen ? 'PREKORAČENO' : 'ZAKAZANO'}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: jeTelefon ? 'column' : 'row', gap: '8px', width: '100%' }}>
                                        <button onClick={(e) => { e.stopPropagation(); setKvarZaZavrsetak(kvar); }} style={{ padding: '11px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', flex: 1 }}>Završi</button>
                                        <button onClick={(e) => { e.stopPropagation(); setKvarZaPrezakazivanje(kvar); }} style={{ padding: '11px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', flex: 1 }}>Novi termin</button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {otvorenIstekliModal && (
                <div onClick={() => setOtvorenIstekliModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px 10px' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '35px 25px 25px 25px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '500px', position: 'relative', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => setOtvorenIstekliModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}>x</button>
                        <h3 style={{ color: '#dc3545', marginTop: 0, marginBottom: '15px', textAlign: 'center' }}>Prekoračeni termini popravki</h3>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', textAlign: 'center' }}>Prošao je termin popravke, ali još uvek nije označena kao rešena:</p>
                        <div style={{ paddingRight: '2px' }}>
                            {istekliKvarovi.map(kvar => (
                                <div key={kvar.id || kvar.Id} onClick={() => setSelektovaniKvar(kvar)} style={{ backgroundColor: '#fff8f8', padding: '12px', borderRadius: '6px', marginBottom: '12px', display: 'flex', flexDirection: jeTelefon ? 'column' : 'row', justifyContent: 'space-between', alignItems: jeTelefon ? 'stretch' : 'center', cursor: 'pointer', border: '1px solid #f8d7da', borderLeft: '5px solid #dc3545', boxSizing: 'border-box', gap: jeTelefon ? '12px' : '10px' }}>
                                    <div style={{ textAlign: 'left', paddingRight: '10px' }}>
                                        <p style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '13px', margin: '0 0 4px 0' }}>Prekoračeno: {formatirajDatum(kvar.datumZakazivanja || kvar.DatumZakazivanja)}</p>
                                        <p style={{ margin: '2px 0', fontSize: '14px', color: '#333' }}><strong>Prijavio:</strong> {formatirajImePrezime(kvar.imePrezime || kvar.ImePrezime)}</p>
                                        <p style={{ margin: '2px 0', fontSize: '14px', color: '#333' }}><strong>{ocistiVrstuKvara(kvar.vrstaKvara || kvar.VrstaKvara)}</strong> (Soba {kvar.lokacija || kvar.Lokacija})</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: jeTelefon ? 'row' : 'column', gap: '6px', minWidth: jeTelefon ? 'auto' : '110px' }}>
                                        <button onClick={(e) => { e.stopPropagation(); setKvarZaZavrsetak(kvar); }} style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', width: '100%', flex: 1 }}>Završi</button>
                                        <button onClick={(e) => { e.stopPropagation(); setKvarZaPrezakazivanje(kvar); if (istekliKvarovi.length <= 1) setOtvorenIstekliModal(false); }} style={{ padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', width: '100%', flex: 1 }}>Novi termin</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {kvarZaZavrsetak && (
                <div
                    onClick={() => setKvarZaZavrsetak(null)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1400, padding: '20px 10px' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', padding: '30px 25px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px', textAlign: 'center', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <h3 style={{ color: '#28a745', marginTop: 0, marginBottom: '15px' }}>Potvrda završetka</h3>
                        <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.5', marginBottom: '25px', fontWeight: 'bold' }}>
                            Da li ste sigurni da želite da označite ovu popravku kao završenu?
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setKvarZaZavrsetak(null)}
                                style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Odustani
                            </button>
                            <button
                                onClick={() => zavrsiPopravku(kvarZaZavrsetak.id || kvarZaZavrsetak.Id)}
                                style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Da, završi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selektovaniKvar && (
                <DetaljiKvaraModal 
                    kvar={selektovaniKvar} 
                    onClose={() => setSelektovaniKvar(null)} 
                    isMajstor={true}
                    onZakaziTerminKlik={(kvar) => setKvarZaPrezakazivanje(kvar)}
                />
            )}
            {kvarZaPrezakazivanje && (
                <ZakaziKvarModal
                    kvar={kvarZaPrezakazivanje}
                    onClose={() => setKvarZaPrezakazivanje(null)}
                    onUspeh={fetchZakazaneKvarove}
                    setPoruka={setPoruka}
                />
            )}
        </div>
    );
};

export default MajstorZakazani;
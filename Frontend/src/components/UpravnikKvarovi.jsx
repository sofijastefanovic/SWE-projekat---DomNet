import React, { useState, useEffect } from 'react';
import UpravnikMeni from './UpravnikMeni.jsx';
import DetaljiKvaraModal from './DetaljiKvaraModal.jsx';
import konfiguracija from '../konfiguracija.js';

const UpravnikKvarovi = () => {
    const [sviKvarovi, setSviKvarovi] = useState([]);
    const [filtriraniKvarovi, setFiltriraniKvarovi] = useState([]);
    const [izabraniStatus, setIzabraniStatus] = useState('sve');
    const [pretragaSobe, setPretragaSobe] = useState('');
    const [selektovaniKvar, setSelektovaniKvar] = useState(null);
    const [poruka, setPoruka] = useState('');
    const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);

   
    useEffect(() => {
        const handleResize = () => setSirinaEkrana(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    const ocistiVrstuKvara = (tekst) => {
        if (!tekst) return '';
        return tekst.split('(')[0].trim();
    };

   
    const formatirajDatum = (datumString) => {
        if (!datumString) return 'Nije urgentno';
        const d = new Date(datumString);
        if (d.getFullYear() === 1970) return 'Nije urgentno';
        return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
    };

    
    const odrediVremePromeneStatusa = (kvar) => {
        const status = kvar.status?.toLowerCase();
        if (status === 'završeno') return kvar.datumPopravke;
        if (status === 'zakazano') return kvar.vremeZakazivanja || kvar.datumZakazivanja;
        return kvar.datumPrijave;
    };

    
    const ucitajKvarove = async () => {
        try {
            const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/sve?t=${Date.now()}`);
            if (response.ok) {
                const podaci = await response.json();

                
                const sortirani = podaci.sort((a, b) => {
                    const vremeA = new Date(odrediVremePromeneStatusa(a)).getTime();
                    const vremeB = new Date(odrediVremePromeneStatusa(b)).getTime();
                    return vremeB - vremeA;
                });

                setSviKvarovi(sortirani);
                setFiltriraniKvarovi(sortirani);
            }
        } catch (error) {
            console.error(error);
            setPoruka('Greška pri komunikaciji sa serverom.');
        }
    };

    
    useEffect(() => {
        ucitajKvarove();
    }, []);

    
    useEffect(() => {
        let privremeniKvarovi = [...sviKvarovi];
        const trenutnoVreme = new Date().getTime();

        if (izabraniStatus === 'zakazano') {
            privremeniKvarovi = privremeniKvarovi.filter(k => k.status?.toLowerCase() === 'zakazano' && !(k.datumZakazivanja && new Date(k.datumZakazivanja).getTime() + (2 * 60 * 60 * 1000) < trenutnoVreme));
        } else if (izabraniStatus === 'prekoračeno') {
            privremeniKvarovi = privremeniKvarovi.filter(k => k.status?.toLowerCase() === 'zakazano' && (k.datumZakazivanja && new Date(k.datumZakazivanja).getTime() + (2 * 60 * 60 * 1000) < trenutnoVreme));

        } else if (izabraniStatus === 'završeno') {
            privremeniKvarovi = privremeniKvarovi.filter(k => k.status?.toLowerCase() === 'završeno');
        } else if (izabraniStatus === 'zakazano') {
            privremeniKvarovi = privremeniKvarovi.filter(k => k.status?.toLowerCase() === 'zakazano' && !(k.datumZakazivanja && new Date(k.datumZakazivanja).getTime() < trenutnoVreme));
        } 

        if (pretragaSobe.trim() !== '') {
            privremeniKvarovi = privremeniKvarovi.filter(k => k.lokacija?.toLowerCase().includes(pretragaSobe.toLowerCase()));
        }

        
        privremeniKvarovi.sort((a, b) => {
            const vremeA = new Date(odrediVremePromeneStatusa(a)).getTime();
            const vremeB = new Date(odrediVremePromeneStatusa(b)).getTime();
            return vremeB - vremeA;
        });

        setFiltriraniKvarovi(privremeniKvarovi);
    }, [izabraniStatus, pretragaSobe, sviKvarovi]);

    
    const odrediBojuStatusa = (status, datumZakazivanja) => {
        if (!status) return '#007bff';
        const s = status.toLowerCase();
        if (s === 'završeno') return 'green';
        if (s === 'na čekanju') return '#ffc107';
        if (s === 'zakazano') {
            const trenchesVreme = new Date().getTime();
            return datumZakazivanja && new Date(datumZakazivanja).getTime() + (2 * 60 * 60 * 1000) < trenchesVreme ? '#dc3545' : '#fd7e14';
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

    const jeMaliEkran = sirinaEkrana <= 768;

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            margin: 0,
            padding: sirinaEkrana <= 600 ? '20px 12px' : '30px',
            backgroundColor: '#f9f9f9',
            boxSizing: 'border-box',
            fontFamily: 'Arial, sans-serif'
        }}>
            <UpravnikMeni />

            {}

            {poruka && <p style={{ color: 'red' }}>{poruka}</p>}

            <div style={{
                display: 'flex',
                flexDirection: jeMaliEkran ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: jeMaliEkran ? 'stretch' : 'center',
                gap: '15px',
                marginBottom: '25px',
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                boxSizing: 'border-box'
            }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                    {}
                    <label style={{ fontWeight: 'bold', fontSize: 'clamp(13px, 1.2vw, 14.5px)', color: '#555' }}>Pretraga po sobi:</label>
                    <input
                        type="text"
                        value={pretragaSobe}
                        onChange={(e) => setPretragaSobe(e.target.value)}
                        placeholder="Ukucaj broj sobe..."
                        style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: 'clamp(12.5px, 1.1vw, 14px)', width: '100%', boxSizing: 'border-box', height: '40px' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                    <label style={{ fontWeight: 'bold', fontSize: 'clamp(13px, 1.2vw, 14.5px)', color: '#555' }}>Filtriraj po statusu:</label>
                    <select
                        value={izabraniStatus}
                        onChange={(e) => setIzabraniStatus(e.target.value)}
                        style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: 'clamp(12.5px, 1.1vw, 14px)', fontWeight: 'bold', color: '#333', backgroundColor: 'white', cursor: 'pointer', height: '40px', width: '100%', boxSizing: 'border-box' }}
                    >
                        <option value="sve">Prikaži sve kvarove</option>
                        <option value="na čekanju">Na čekanju (Novi)</option>
                        <option value="zakazano">Zakazano (Redovni rokovi)</option>
                        <option value="prekoračeno">Prekoračeno (Kašnjenja majstora)</option>
                        <option value="završeno">Završeno (Popravljeno)</option>
                    </select>
                </div>

            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', overflowX: 'auto', width: '100%', boxSizing: 'border-box' }}>
                {filtriraniKvarovi.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '40px', fontSize: 'clamp(13px, 1.2vw, 15px)' }}>Nema kvarova koji odgovaraju zadatim filterima pretrage.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                            {}
                            <tr style={{ backgroundColor: '#f4f6f9', borderBottom: '2px solid #eee', color: '#444', fontSize: 'clamp(12px, 1.1vw, 13.5px)' }}>
                                <th style={{ padding: '12px 15px' }}>Soba</th>
                                <th style={{ padding: '12px 15px' }}>Kvar</th>
                                <th style={{ padding: '12px 15px' }}>Trenutni status</th>
                                <th style={{ padding: '12px 15px' }}>Vreme promene statusa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtriraniKvarovi.map((kvar) => {
                                const trenchesBoja = odrediBojuStatusa(kvar.status, kvar.datumZakazivanja);
                                return (
                                   
                                    <tr
                                        key={kvar.id}
                                        onClick={() => setSelektovaniKvar(kvar)}
                                        style={{ borderBottom: '1px solid #eee', cursor: 'pointer', fontSize: 'clamp(12.5px, 1.1vw, 14px)', transition: 'background-color 0.1s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fcfcfc'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>Soba {kvar.lokacija}</td>
                                        <td style={{ padding: '15px' }}>{ocistiVrstuKvara(kvar.vrstaKvara)}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ fontWeight: 'bold', color: trenchesBoja, textTransform: 'capitalize' }}>
                                                {prikaziTekstStatusa(kvar.status, kvar.datumZakazivanja)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', color: '#555' }}>
                                            {formatirajDatum(odrediVremePromeneStatusa(kvar))}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {selektovaniKvar && (
                <DetaljiKvaraModal kvar={selektovaniKvar} onClose={() => setSelektovaniKvar(null)} isMajstor={true} />
            )}
        </div>
    );
};

export default UpravnikKvarovi;
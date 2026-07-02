import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentMeni from './StudentMeni.jsx';
import konfiguracija from '../konfiguracija.js';

const StudentObavestenja = () => {
    const [obavestenja, setObavestenja] = useState([]);
    const [poruka, setPoruka] = useState('');
    const navigate = useNavigate();

   
    const ocistiVrstuKvara = (tekst) => {
        if (!tekst) return '';
        return tekst.split('(')[0].trim();
    };

    
    const formatirajDatum = (datumString) => {
        if (!datumString) return 'Nije definisano';
        const d = new Date(datumString);
        return d.toLocaleDateString('sr-RS') + ' u ' + d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) + 'h';
    };

   
    const formatirajDatumPrikaz = (datumString) => {
        if (!datumString) return '';
        const cistiDatum = datumString.split('T')[0];
        const delovi = cistiDatum.split('-');
        if (delovi.length !== 3) return datumString;
        return `${delovi[2]}.${delovi[1]}.${delovi[0]}.`;
    };

   
    const fetchObavestenja = async () => {
        try {
            const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');
            if (!sacuvaniKorisnik) return;
            const korisnikPodaci = JSON.parse(sacuvaniKorisnik);
            const mojId = korisnikPodaci.id || korisnikPodaci.korisnikId;
            const studentId = korisnikPodaci.studentId || korisnikPodaci.id;

            
            const [resKvarovi, resMasine, resVazna] = await Promise.all([
                fetch(`${konfiguracija.baseURL}/api/kvarovi/sve`),
                fetch(`${konfiguracija.baseURL}/api/vesmasine/moje-rezervacije/${studentId}`),
                fetch(`${konfiguracija.baseURL}/api/pocetna/vazna`)
            ]);

            let unificiraniKvarovi = [];
            let unificiraneMasine = [];
            let unificiranaVazna = [];

            if (resKvarovi.ok) {
                const podaciKvarovi = await resKvarovi.json();
                const promenjeniKvarovi = podaciKvarovi.filter(k =>
                    k.status &&
                    k.status.toLowerCase() !== 'na čekanju' &&
                    k.korisnikId === mojId
                );

                unificiraniKvarovi = promenjeniKvarovi.map(k => ({
                    unikatniId: `kvar-${k.id}`,
                    izvorniId: k.id,
                    tip: 'kvar',
                    status: k.status,
                    datumZaSort: k.datumPopravke || k.vremeZakazivanja || k.datumZakazivanja || k.datumPrijave,
                    vrstaKvara: k.vrstaKvara,
                    lokacija: k.lokacija,
                    brojIzmena: k.brojIzmena || k.BrojIzmena || k.brojizmena || 0,
                    vremeZakazivanja: k.vremeZakazivanja || k.datumZakazivanja
                }));
            }

            if (resMasine.ok) {
                const podaciMasine = await resMasine.json();
                const promenjeneMasine = podaciMasine.filter(r =>
                    r.status &&
                    r.status.toLowerCase() !== 'na cekanju'
                );

                unificiraneMasine = promenjeneMasine.map(r => ({
                    unikatniId: `masina-${r.id}`,
                    izvorniId: r.id,
                    tip: 'masina',
                    status: r.status,
                    datumZaSort: r.datumOdgovora || r.datumZahteva || r.datum,
                    nazivMasine: r.vesMasina?.naziv || 'Veš mašina',
                    datumRezervacije: r.datum
                }));
            }

            if (resVazna.ok) {
                const podaciVazna = await resVazna.json();
                unificiranaVazna = podaciVazna.map(v => ({
                    unikatniId: `vazno-${v.id}`,
                    izvorniId: v.id,
                    tip: 'vazno',
                    status: 'ZVANIČNO',
                    datumZaSort: v.datum,
                    naziv: v.naziv,
                    tekst: v.tekst
                }));
            }

            
            const sveZajedno = [...unificiraniKvarovi, ...unificiraneMasine, ...unificiranaVazna].sort((a, b) => {
                return new Date(b.datumZaSort) - new Date(a.datumZaSort);
            });

            setObavestenja(sveZajedno);
        } catch (error) {
            console.error('Greška pri učitavanju obaveštenja:', error);
            setPoruka('Nije moguće učitati obaveštenja.');
        }
    };

    useEffect(() => {
        localStorage.setItem('studentZadnjaPoseta', new Date().getTime().toString());
        fetchObavestenja();
    }, []);

    return (
        <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: '30px', backgroundColor: '#f9f9f9', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', scrollbarGutter: 'stable' }}>
            <StudentMeni />

            <h2 style={{ color: '#333', marginBottom: '20px', textAlign: 'left' }}>Moja obaveštenja</h2>

            {poruka && <p style={{ color: 'red' }}>{poruka}</p>}

            {obavestenja.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '30px' }}>
                    Nemate novih obaveštenja.
                </p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {obavestenja.map((stavka) => {
                        const statusLower = stavka.status?.toLowerCase();

                        let bojaTrake = '#007bff';
                        let bojaTekstaStatusa = '#007bff';
                        let pozadinaStatusa = '#e6f2ff';
                        let tekstStatusa = stavka.status;

                        if (stavka.tip === 'vazno') {
                            bojaTrake = '#dc3545'; 
                            bojaTekstaStatusa = '#dc3545';
                            pozadinaStatusa = '#fce8e6';
                            tekstStatusa = 'ZVANIČNO OBAVEŠTENJE';
                        } else if (statusLower === 'završeno' || statusLower === 'odobreno') {
                            bojaTrake = 'green';
                            bojaTekstaStatusa = 'green';
                            pozadinaStatusa = '#e6f4ea';
                        } else if (statusLower === 'odbijeno') {
                            bojaTrake = '#dc3545';
                            bojaTekstaStatusa = '#dc3545';
                            pozadinaStatusa = '#fce8e6';
                        } else if (statusLower === 'zakazano') {
                            const trenutnoVreme = new Date().getTime();
                            const jePrekoracen = stavka.datumZakazivanja && new Date(stavka.datumZakazivanja).getTime() < trenutnoVreme;

                            if (jePrekoracen) {
                                bojaTrake = '#dc3545';
                                bojaTekstaStatusa = '#dc3545';
                                pozadinaStatusa = '#fce8e6';
                                tekstStatusa = 'Prekoračeno';
                            } else {
                                bojaTrake = '#fd7e14';
                                bojaTekstaStatusa = '#fd7e14';
                                pozadinaStatusa = '#fff3cd';
                            }
                        }

                        return (
                            <li
                                key={stavka.unikatniId}
                                onClick={() => {
                                    if (stavka.tip === 'kvar') {
                                        navigate('/student/kvarovi', { state: { autoOpenKvarId: stavka.izvorniId } });
                                    } else if (stavka.tip === 'vazno') {
                                        navigate('/student');
                                    } else {
                                        navigate('/student/masine');
                                    }
                                }}
                                style={{
                                    backgroundColor: 'white', padding: '20px', borderRadius: '8px',
                                    borderLeft: `5px solid ${bojaTrake}`, boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                                    display: 'flex', flexDirection: 'column', gap: '5px', boxSizing: 'border-box',
                                    cursor: 'pointer', transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                                    <span style={{ fontWeight: 'bold', color: bojaTekstaStatusa, backgroundColor: pozadinaStatusa, padding: '4px 10px', borderRadius: '4px', fontSize: '12px', textTransform: 'uppercase' }}>
                                        {tekstStatusa}
                                    </span>
                                    <span style={{ fontSize: '13px', color: '#888' }}>
                                        {formatirajDatum(stavka.datumZaSort)}
                                    </span>
                                </div>

                                <p style={{ margin: '8px 0 0 0', fontSize: '15px', color: '#333', lineHeight: '1.4' }}>
                                    {stavka.tip === 'vazno' ? (
                                        <>
                                            Uprava doma je postavila novo obaveštenje: <strong>{stavka.naziv}</strong>. <br />
                                            <span style={{ color: '#555', fontStyle: 'italic' }}>{stavka.tekst && stavka.tekst.substring(0, 100)}...</span>
                                        </>
                                    ) : stavka.tip === 'kvar' ? (
                                        statusLower === 'završeno' ? (
                                            <>Vaša prijava za kvar <strong>{ocistiVrstuKvara(stavka.vrstaKvara)}</strong> u sobi <strong>{stavka.lokacija}</strong> je uspešno rešena.</>
                                        ) : (
                                            <>
                                                {stavka.brojIzmena > 1 ? (
                                                    <>
                                                        Majstor je <strong>izmenio</strong> termin dolaska za kvar <strong>{ocistiVrstuKvara(stavka.vrstaKvara)}</strong> u sobi <strong>{stavka.lokacija}</strong>. <br />
                                                        Novi termin dolaska je: <strong style={{ color: '#fd7e14' }}>{formatirajDatum(stavka.vremeZakazivanja)}</strong>.
                                                    </>
                                                ) : (
                                                    <>
                                                        Majstor je <strong>definisao</strong> termin dolaska za Vašu prijavu kvara <strong>{ocistiVrstuKvara(stavka.vrstaKvara)}</strong> u sobi <strong>{stavka.lokacija}</strong>. <br />
                                                        Majstor dolazi: <strong style={{ color: '#fd7e14' }}>{formatirajDatum(stavka.vremeZakazivanja)}</strong>.
                                                    </>
                                                )}
                                            </>
                                        )
                                    ) : (
                                        statusLower === 'odobreno' ? (
                                            <>Portir je <strong>odobrio</strong> Vaš zahtev za korišćenje mašine <strong>{stavka.nazivMasine}</strong> za datum <strong>{formatirajDatumPrikaz(stavka.datumRezervacije)}</strong>.</>
                                        ) : (
                                            <>Portir je <strong>odbio</strong> Vaš zahtev za korišćenje mašine <strong>{stavka.nazivMasine}</strong> za datum <strong>{formatirajDatumPrikaz(stavka.datumRezervacije)}</strong>.</>
                                        )
                                    )}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default StudentObavestenja;
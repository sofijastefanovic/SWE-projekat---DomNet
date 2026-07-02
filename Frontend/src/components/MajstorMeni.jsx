import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import konfiguracija from '../konfiguracija.js';


const MajstorMeni = () => {
  const location = useLocation();
  const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);
  const [otvorenMobilniMeni, setOtvorenMobilniMeni] = useState(false);
  const [brojNovih, setBrojNovih] = useState(0);

 
  useEffect(() => {
    const handleResize = () => setSirinaEkrana(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 
  const proveriNoveKvarove = async () => {
    try {
        const response = await fetch(`${konfiguracija.baseURL}/api/kvarovi/novi`);
      if (response.ok) {
        const podaci = await response.json();
        const pogledaniKvarovi = JSON.parse(localStorage.getItem('majstorPogledaniKvarovi') || '[]');
        
        const neprocitani = podaci.filter(kvar => !pogledaniKvarovi.includes(kvar.id));
        setBrojNovih(neprocitani.length);
      }
    } catch (error) {
      console.error('Greška pri osvežavanju broja prijava u meniju:', error);
    }
  };

  
  useEffect(() => {
    proveriNoveKvarove();

    window.addEventListener('storage', proveriNoveKvarove);

    const interval = setInterval(proveriNoveKvarove, 10000);
    
    return () => {
      window.removeEventListener('storage', proveriNoveKvarove);
      clearInterval(interval);
    };
  }, []);

  const jeMobilni = sirinaEkrana <= 1024;

  
  const stilDugmeta = (putanja) => ({
    padding: '10px 16px',
    textDecoration: 'none',
    color: location.pathname === putanja ? 'white' : '#555',
    backgroundColor: location.pathname === putanja ? '#007bff' : 'transparent',
    fontWeight: 'bold',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    fontSize: '14.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: jeMobilni ? '100%' : 'auto',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    position: 'relative' 
  });

  return (
    <nav style={{
      backgroundColor: 'white', 
      padding: '15px 25px', 
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
      marginBottom: '25px',
      display: 'flex', 
      flexDirection: jeMobilni ? 'column' : 'row',
      justifyContent: 'space-between', 
      alignItems: jeMobilni ? 'stretch' : 'center',
      gap: jeMobilni && otvorenMobilniMeni ? '15px' : '0px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: jeMobilni ? '100%' : 'auto' }}>
        <h3 style={{ margin: 0, color: '#333', fontSize: '18px', fontWeight: 'bold' }}>DomNet</h3>
        
        {jeMobilni && (
          <button 
            onClick={() => setOtvorenMobilniMeni(!otvorenMobilniMeni)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '26px', 
              cursor: 'pointer', 
              color: '#333', 
              fontWeight: 'bold', 
              padding: 0, 
              width: '45px', 
              height: '35px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative' 
            }}
          >
            {otvorenMobilniMeni ? '✕' : '☰'}

            {!otvorenMobilniMeni && brojNovih > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#dc3545',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1',
                boxShadow: '0 0 0 2px white'
              }}>
                {brojNovih}
              </span>
            )}
          </button>
        )}
      </div>
      
      {(!jeMobilni || otvorenMobilniMeni) && (
        <div style={{ 
          display: 'flex', 
          flexDirection: jeMobilni ? 'column' : 'row', 
          gap: '8px',
          alignItems: 'stretch',
          width: jeMobilni ? '100%' : 'auto',
          marginTop: jeMobilni ? '10px' : '0'
        }}>
          <Link to="/majstor" style={stilDugmeta('/majstor')} onClick={() => setOtvorenMobilniMeni(false)}>
            Početna
            {brojNovih > 0 && (
              <span style={{
                backgroundColor: '#dc3545',
                color: 'white',
                fontSize: '11px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '8px',
                lineHeight: '1'
              }}>
                {brojNovih}
              </span>
            )}
          </Link>
          
          <Link to="/majstor/raspored" style={stilDugmeta('/majstor/raspored')} onClick={() => setOtvorenMobilniMeni(false)}>
            Raspored popravki
          </Link>

          <Link to="/majstor/kalendar" style={stilDugmeta('/majstor/kalendar')} onClick={() => setOtvorenMobilniMeni(false)}>
            Kalendar
          </Link>
          
          <Link to="/majstor/zavrseni" style={stilDugmeta('/majstor/zavrseni')} onClick={() => setOtvorenMobilniMeni(false)}>
            Završeni radni nalozi
          </Link>
        </div>
      )}
      
      {(!jeMobilni || otvorenMobilniMeni) && (
        <div style={{ display: 'flex', justifyContent: 'center', width: jeMobilni ? '100%' : 'auto', marginTop: jeMobilni ? '5px' : '0' }}>
          <Link 
            to="/" 
            onClick={() => {
              localStorage.removeItem('trenutniKorisnik');
              sessionStorage.clear();
            }}
            style={{ padding: '10px 16px', textDecoration: 'none', color: '#dc3545', border: '1px solid #dc3545', backgroundColor: 'transparent', fontWeight: 'bold', borderRadius: '6px', fontSize: '14.5px', transition: 'all 0.2s ease', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
          >
            Odjava
          </Link>
        </div>
      )}
    </nav>
  );
};

export default MajstorMeni;
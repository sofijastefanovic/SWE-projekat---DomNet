import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const UpravnikMeni = () => {
  const location = useLocation();
  const [sirinaEkrana, setSirinaEkrana] = useState(window.innerWidth);
  const [otvorenMobilniMeni, setOtvorenMobilniMeni] = useState(false);

  
  useEffect(() => {
    const handleResize = () => setSirinaEkrana(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  });

  return (
    
    <nav style={{
      backgroundColor: 'white', padding: '15px 25px', borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '25px',
      display: 'flex', flexDirection: jeMobilni ? 'column' : 'row',
      justifyContent: 'space-between', alignItems: jeMobilni ? 'stretch' : 'center',
      gap: jeMobilni && otvorenMobilniMeni ? '15px' : '0px'
    }}>
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: jeMobilni ? '100%' : 'auto' }}>
        <h3 style={{ margin: 0, color: '#333', fontSize: '18px', fontWeight: 'bold' }}>DomNet</h3>
        
        {}
        {jeMobilni && (
          <button 
            onClick={() => setOtvorenMobilniMeni(!otvorenMobilniMeni)}
            style={{ background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', color: '#333', fontWeight: 'bold', padding: 0, width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {otvorenMobilniMeni ? '✕' : '☰'}
          </button>
        )}
      </div>
      
      {}
      {(!jeMobilni || otvorenMobilniMeni) && (
        <>
          {}
          <div style={{ 
            display: 'flex', flexDirection: jeMobilni ? 'column' : 'row', 
            gap: '8px', alignItems: 'stretch', width: jeMobilni ? '100%' : 'auto', 
            marginTop: jeMobilni ? '10px' : '0' 
          }}>
            <Link to="/upravnik" style={stilDugmeta('/upravnik')} onClick={() => setOtvorenMobilniMeni(false)}>Obaveštenja</Link>
            <Link to="/upravnik/izvestaji" style={stilDugmeta('/upravnik/izvestaji')} onClick={() => setOtvorenMobilniMeni(false)}>Dnevni izveštaji</Link>
            <Link to="/upravnik/kvarovi" style={stilDugmeta('/upravnik/kvarovi')} onClick={() => setOtvorenMobilniMeni(false)}>Registar popravki</Link>
            <Link to="/upravnik/studenti" style={stilDugmeta('/upravnik/studenti')} onClick={() => setOtvorenMobilniMeni(false)}>Stanari doma</Link>
          </div>
          
          {}
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
        </>
      )}
    </nav>
  );
};

export default UpravnikMeni;
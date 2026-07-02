import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import konfiguracija from './konfiguracija.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [sifra, setSifra] = useState('');
  const [greska, setGreska] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setGreska('');

    try {
        const response = await fetch(`${konfiguracija.baseURL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sifra })
      });

      if (response.ok) {
        const korisnik = await response.json();
        
        localStorage.setItem('trenutniKorisnik', JSON.stringify(korisnik));
        
        if (korisnik.tip === 'majstor') {
          const prosliOdlazak = localStorage.getItem('majstorZadnjiOdlazak') || new Date().getTime().toString();
          sessionStorage.setItem('majstorReferentnoVreme', prosliOdlazak);
          localStorage.setItem('majstorZadnjiOdlazak', new Date().getTime().toString());
          navigate('/majstor');
        } else if (korisnik.tip === 'student') {
          navigate('/student');
        } else if (korisnik.tip === 'portir') {
          navigate('/portir');
        } else if (korisnik.tip === 'upravnik') {
          navigate('/upravnik');
        }else if (korisnik.tip === 'admin'){
          navigate('/admin');
        }
      } else {
        setGreska('Pogrešan email ili lozinka. Pokušajte ponovo.');
      }
    } catch (error) {
      setGreska('Nije moguće uspostaviti vezu sa serverom.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        
        <h1 style={{ color: '#007bff', fontSize: '60px', margin: '0 0 25px 0', fontWeight: 'bold', letterSpacing: '-1px' }}>DomNet</h1>
        
        {greska && <p style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px', fontSize: '14px', marginBottom: '15px' }}>{greska}</p>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ textAlignment: 'left' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Email adresa:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ textAlignment: 'left' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Lozinka:</label>
            <input 
              type="password" 
              value={sifra} 
              onChange={(e) => setSifra(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
            Uloguj se
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;
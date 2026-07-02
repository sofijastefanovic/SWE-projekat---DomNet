import React from 'react';
import { Navigate } from 'react-router-dom';

const ZasticenaRuta = ({ children, dozvoljeneUloge }) => {
    const sacuvaniKorisnik = localStorage.getItem('trenutniKorisnik');

    if (!sacuvaniKorisnik) {
        
        return <Navigate to="/" replace />;
    }

    const korisnik = JSON.parse(sacuvaniKorisnik);
    
    const ulogaKorisnika = korisnik.uloga || korisnik.Uloga || korisnik.tip; 

    if (dozvoljeneUloge && !dozvoljeneUloge.includes(ulogaKorisnika.toLowerCase())) {
        return <Navigate to="/nemate-pristup" replace />; 
    }

    return children;
};

export default ZasticenaRuta;
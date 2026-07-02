import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "./Login.jsx"; 
import ZasticenaRuta from "./ZasticenaRuta.jsx"; 

import MajstorPocetna from "./components/MajstorPocetna.jsx"; 
import MajstorKalendar from "./components/MajstorKalendar.jsx"; 
import MajstorZakazani from "./components/MajstorZakazani.jsx";
import MajstorZavrseni from "./components/MajstorZavrseni.jsx"; 

//STUDENT
import StudentPocetna from "./components/StudentPocetna.jsx";
import StudentForum from "./components/StudentForum.jsx";
import StudentKvarovi from "./components/StudentKvarovi.jsx";
import DostupnostMasina from "./components/DostupnostMasina.jsx";
import StudentProfil from "./components/StudentProfil.jsx";
import StudentObavestenja from "./components/StudentObavestenja.jsx";

//UPRAVNIK
import UpravnikPocetna from "./components/UpravnikPocetna.jsx";
import UpravnikIzvestaji from "./components/UpravnikIzvestaji.jsx";
import UpravnikKvarovi from "./components/UpravnikKvarovi.jsx";
import UpravnikStudenti from "./components/UpravnikStudenti.jsx";

//PORTIR
import PortirPocetna from "./components/PortirPocetna.jsx";
import PortirIzvestaji from "./components/PortirIzvestaji.jsx";
import PortirMasine from "./components/PortirMasine.jsx";
import PortirKvarovi from "./components/PortirKvarovi.jsx";
import PortirObavestenja from "./components/PortirObavestenja.jsx"; 
import PortirProfil from "./components/PortirProfil.jsx";

//ADMIN
import AdminPocetna from "./components/AdminPocetna.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/nemate-pristup" element={
            <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
                <h2 style={{ color: '#dc3545' }}>Nemate prava pristupa ovoj stranici.</h2>
                <a href="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Vratite se na početnu</a>
            </div>
        } />
        
        {/* MAJSTOR */}
        <Route path="/majstor" element={<ZasticenaRuta dozvoljeneUloge={['majstor']}><MajstorPocetna /></ZasticenaRuta>} />
        <Route path="/majstor/raspored" element={<ZasticenaRuta dozvoljeneUloge={['majstor']}><MajstorZakazani /></ZasticenaRuta>} /> 
        <Route path="/majstor/kalendar" element={<ZasticenaRuta dozvoljeneUloge={['majstor']}><MajstorKalendar /></ZasticenaRuta>} />
        <Route path="/majstor/zavrseni" element={<ZasticenaRuta dozvoljeneUloge={['majstor']}><MajstorZavrseni /></ZasticenaRuta>} />
        
        {/* STUDENT */}
        <Route path="/student" element={<ZasticenaRuta dozvoljeneUloge={['student']}><StudentPocetna /></ZasticenaRuta>} />
        <Route path="/student/forum" element={<ZasticenaRuta dozvoljeneUloge={['student']}><StudentForum /></ZasticenaRuta>} />
        <Route path="/student/kvarovi" element={<ZasticenaRuta dozvoljeneUloge={['student']}><StudentKvarovi /></ZasticenaRuta>} />
        <Route path="/student/masine" element={<ZasticenaRuta dozvoljeneUloge={['student']}><DostupnostMasina /></ZasticenaRuta>} />
        <Route path="/student/obavestenja" element={<ZasticenaRuta dozvoljeneUloge={['student']}><StudentObavestenja /></ZasticenaRuta>} />
        <Route path="/student/profil" element={<ZasticenaRuta dozvoljeneUloge={['student']}><StudentProfil /></ZasticenaRuta>} />
        
        {/* UPRAVNIK */}
        <Route path="/upravnik" element={<ZasticenaRuta dozvoljeneUloge={['upravnik']}><UpravnikPocetna /></ZasticenaRuta>} />
        <Route path="/upravnik/izvestaji" element={<ZasticenaRuta dozvoljeneUloge={['upravnik']}><UpravnikIzvestaji /></ZasticenaRuta>} />
        <Route path="/upravnik/kvarovi" element={<ZasticenaRuta dozvoljeneUloge={['upravnik']}><UpravnikKvarovi /></ZasticenaRuta>} />
        <Route path="/upravnik/studenti" element={<ZasticenaRuta dozvoljeneUloge={['upravnik']}><UpravnikStudenti /></ZasticenaRuta>} />
        
        {/* PORTIR */}
        <Route path="/portir" element={<ZasticenaRuta dozvoljeneUloge={['portir']}><PortirPocetna /></ZasticenaRuta>} />
        <Route path="/portir/obavestenja" element={<ZasticenaRuta dozvoljeneUloge={['portir']}><PortirObavestenja /></ZasticenaRuta>} /> 
        <Route path="/portir/izvestaji" element={<ZasticenaRuta dozvoljeneUloge={['portir']}><PortirIzvestaji /></ZasticenaRuta>} />
        <Route path="/portir/masine" element={<ZasticenaRuta dozvoljeneUloge={['portir']}><PortirMasine /></ZasticenaRuta>} />
        <Route path="/portir/kvarovi" element={<ZasticenaRuta dozvoljeneUloge={['portir']}><PortirKvarovi /></ZasticenaRuta>} />
        <Route path="/portir/profil" element={<ZasticenaRuta dozvoljeneUloge={['portir']}><PortirProfil /></ZasticenaRuta>} />

       {/* ADMIN */}
       <Route path="/admin" element={<ZasticenaRuta dozvoljeneUloge={['admin']}><AdminPocetna /></ZasticenaRuta>} />
      </Routes>
    </Router>
  );
};

export default App;
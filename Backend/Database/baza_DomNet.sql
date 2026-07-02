create database if not exists studenski_dom;
use studenski_dom;

create table korisnik (
	id int auto_increment primary key,
    ime varchar(100) not null,
    email varchar(100) not null unique,
    sifra varchar(100) not null, 
    tip enum('student', 'admin', 'upravnik', 'majstor', 'portir') NOT NULL,
    vreme_kreiranja datetime default current_timestamp );

create table admin (
	id int auto_increment primary key,
    korisnik_id int not null unique, 
    jmbg varchar(13) not null unique, 
    telefon varchar(20) not null unique,
    foreign key (korisnik_id) references korisnik(id) on delete cascade);

create table student (
	id int auto_increment primary key,
    korisnik_id int not null unique, 
    jmbg varchar(13) not null unique, 
    telefon varchar(20) not null unique,
    br_indexa varchar(20) not null unique, 
    br_sobe int,
    fakultet varchar(255),
    smer varchar(255),
    datum_useljenja date,
    foreign key (korisnik_id) references korisnik(id) on delete cascade);


create table portir (
	id int auto_increment primary key,
    korisnik_id int not null unique, 
    jmbg varchar(13) not null unique, 
    telefon varchar(20) not null unique,
    pocetak_rada date,
    foreign key (korisnik_id) references korisnik(id) on delete cascade);
    
create table upravnik (
	id int auto_increment primary key,
    korisnik_id int not null unique, 
    jmbg varchar(13) not null unique, 
    telefon varchar(20) not null unique,
    sektor int, 
    broj_kancelarije int,
    pocetak_rada date,
    foreign key (korisnik_id) references korisnik(id) on delete cascade);
    
    create table majstor (
    id int auto_increment primary key,
    korisnik_id int not null unique, 
    jmbg varchar(13) not null unique, 
    telefon varchar(20) not null unique,
    pocetak_rada date,
    foreign key (korisnik_id) references korisnik(id) on delete cascade
);

create table obavestenje (
    id int auto_increment primary key,
    naziv varchar(200) not null,
    tekst text not null,
    tip enum('vazno', 'obicno') not null default 'obicno',
    autor_id int not null,
    datum datetime default current_timestamp,
    foreign key(autor_id) references korisnik(id) on delete cascade
);

create table izvestaj (
    id int auto_increment primary key,
    naziv varchar(200) not null,
    tekst text,
    tip varchar(20), 
    autor_id int not null,
    datum datetime default current_timestamp,
    foreign key(autor_id) references korisnik(id) on delete cascade
);

create table komentar (
	id int auto_increment primary key,
    obavestenje_id int not null,
    autor_id int not null, 
    tekst text not null,
    datum datetime default current_timestamp,
    foreign key(autor_id) references korisnik(id) on delete cascade,
    foreign key(obavestenje_id) references obavestenje(id) on delete cascade
);

create table reakcija (
	id int auto_increment primary key,
    obavestenje_id int not null,
    autor_id int not null, 
    tip_reakcije enum('lajk', 'love', 'think', 'haha', 'sad') not null default 'lajk',
    datum datetime default current_timestamp,
    unique key jedinstvena_reakcija (obavestenje_id, autor_id), 
    foreign key(autor_id) references korisnik(id) on delete cascade,
    foreign key(obavestenje_id) references obavestenje(id) on delete cascade
);

create table kvar (
    id int auto_increment primary key,
    student_id int not null,
    majstor_id int,
    vrsta_kvara varchar(100) not null,
    lokacija varchar(50) not null,
    opis text,
    status enum('na čekanju', 'zakazano', 'završeno') not null default 'na čekanju',
    datum_prijave datetime default current_timestamp,
    datum_popravke datetime,
    foreign key(student_id) references student(id) on delete cascade,
    foreign key(majstor_id) references majstor(id) on delete set null
);

create table ves_masina (
    id int auto_increment primary key,
    naziv varchar(100) not null,
    lokacija enum( 'prizemlje', 'prvi sprat', 'drugi sprat', 'treci sprat') not null,
    status enum('dostupna', 'neispravna')
    default 'dostupna'
);

create table termin (
    id int auto_increment primary key,
    masina_id int not null,
    datum date not null,
    vreme_od time not null,
    vreme_do time not null,
    foreign key (masina_id)
    references ves_masina(id)
    on delete cascade
);

create table rezervacija (
    id int auto_increment primary key,
    student_id int not null,
    termin_id int not null unique,
    portir_id int,
    status enum('na cekanju', 'odobreno', 'odbijeno') 
    default 'na cekanju',

    datum_zahteva datetime
    default current_timestamp,

    datum_odgovora datetime,

    foreign key(student_id)
    references student(id)
    on delete cascade,

    foreign key(termin_id)
    references termin(id)
    on delete cascade,

    foreign key(portir_id)
    references portir(id)
    on delete set null
);

insert into ves_masina
(naziv, lokacija, status)
values

('Ves masina 1', 'prizemlje', 'dostupna'),

('Ves masina 2', 'prvi sprat', 'dostupna'),

('Ves masina 3', 'drugi sprat', 'dostupna'),

('Ves masina 4', 'treci sprat', 'dostupna');

insert into termin
(masina_id, datum, vreme_od, vreme_do)
values

(1, '2026-05-25', '06:00:00', '09:00:00'),
(1, '2026-05-25', '09:30:00', '12:30:00'),
(1, '2026-05-25', '13:00:00', '16:00:00'),
(1, '2026-05-25', '16:30:00', '19:30:00'),
(1, '2026-05-25', '20:00:00', '23:00:00');



insert into korisnik(ime, email, sifra, tip) values
('Jagodica Admin', 'jagodicabooobicaaa@gmail.com', 'jagodicabobica456', 'admin'),
('Nikola Upravnik', 'nikolanesic80@gmail.com', 'nemasifra1', 'upravnik'),
('Dragan Portir', 'dragan1970@gmail.com', 'marica1973', 'portir'),
('MarijaJovic', 'maaarijaa@gmail.com', 'marimari28', 'student'),
('SofijaStefanovic', 'soffistef@gmail.com', 'sofi456', 'student'),
('MileMajstor', 'mile.majstor@gmail.com', 'milemajstor1', 'majstor');

insert into admin(korisnik_id, jmbg, telefon)
values (1, '0905000445553', '0658956511');

insert into upravnik(korisnik_id, jmbg, telefon, sektor, broj_kancelarije, pocetak_rada)
values (2, '1702980223331', '0632564586', 4, 2, '2020-01-10');

insert into portir(korisnik_id, jmbg, telefon, pocetak_rada)
values (3, '2303970446663', '0612345678','2019-04-23');

insert into student(korisnik_id, jmbg, telefon, br_indexa, br_sobe, fakultet, smer, datum_useljenja)
values (4, '1809002336664', '0647897889','16896', 413, 'masinski', 'inzenjerski menadzment', '2022-02-03'),
 (5, '0106004444444', '0641234569','19943', 244, 'elektronski', 'racunarstvo i informatika', '2023-04-01');
 
insert into majstor(korisnik_id, jmbg, telefon, pocetak_rada)
values (6, '1205980778889', '0641112223', '2015-05-01');

insert into kvar(student_id, vrsta_kvara, lokacija, opis, status) values
(1, 'vodovod', 'Soba 413', 'Curi slavina u kupatilu i kaplje na pod.', 'na čekanju'),
(2, 'Stolarija', 'Soba 244', 'Ne mogu da se zatvore vrata od ormara.', 'na čekanju');
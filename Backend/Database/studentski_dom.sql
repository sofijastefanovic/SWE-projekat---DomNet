-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2026 at 04:45 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `studentski_dom`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) NOT NULL,
  `jmbg` varchar(13) NOT NULL,
  `telefon` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `korisnik_id`, `jmbg`, `telefon`) VALUES
(1, 1, '0905000445553', '0658956511');

-- --------------------------------------------------------

--
-- Table structure for table `izvestaj`
--

CREATE TABLE `izvestaj` (
  `id` int(11) NOT NULL,
  `naziv` varchar(200) NOT NULL,
  `tekst` text DEFAULT NULL,
  `tip` varchar(20) DEFAULT NULL,
  `autor_id` int(11) NOT NULL,
  `datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `izvestaj`
--

INSERT INTO `izvestaj` (`id`, `naziv`, `tekst`, `tip`, `autor_id`, `datum`) VALUES
(4, 'Izveštaj - Prva smena', 'Smena je protekla mirno i bez ikakvih incidenata, a primopredaja dužnosti izvršena je uredno u 06:00 časova. Svi posetioci i vozila su tokom smene upisani u knjigu dežurstva, a kurirske službe su dostavile tri pošiljke koje su odložene na recepciji. Video nadzor i alarmni sistemi rade bez ikakve greške, pa je smena predata kolegi iz druge smene u 14:00 časova u potpunom redu.', 'Prva', 3, '2026-06-25 17:28:40'),
(5, 'Izveštaj - Druga smena', 'Tokom popodnevne smene situacija je generalno bila stabilna, uz jedan tehnički problem koji je odmah prijavljen nadležnima. Oko 17:45 časova primećeno je da rampa na glavnom parkingu kod ulaza B ne reaguje na daljinske upravljače i kartice zaposlenih, pa je rampa ručno podignuta i obezbeđena kako se ne bi stvarala gužva. Odmah sam kontaktirao dežurnog majstora koji je izašao na teren i ustanovio kvar na elektronici, a popravka je najavljena za sutra ujutru. Svi ostali sistemi su u potpunom redu.', 'Druga', 3, '2026-06-26 17:32:00'),
(6, 'Izveštaj - Druga smena', 'Podnosim izveštaj za noćnu smenu tokom koje je objekat bio zaključan i bezbedan. Oko 03:45 časova na monitorima je primećeno zadržavanje nepoznatog lica ispred glavne kapije, ali se nakon mog usmenog upozorenja preko interfona to lice udaljilo u nepoznatom pravcu i nije bilo pokušaja narušavanja bezbednosti. Svi sigurnosni sistemi su u funkciji i rade bez prekida, a smena je predata ujutru u 06:00 časova.\n', 'Druga', 3, '2026-06-25 17:33:02'),
(7, 'Izveštaj - Prva smena', 'Ovim putem Vas obaveštavam o incidentu koji se dogodio danas u 16:20 časova kada je jedna stranka pokušala da uđe u objekat bez ličnih dokumenata i zakazanog termina. Nakon što sam joj predočio pravila objekta i odbio da je pustim, stranka je počela verbalno da me vređa i odbijala je da napusti prostoriju prijavnice. Ostao sam smiren i pozvao šefa obezbeđenja, pa je nakon dolaska kolega lice ispraćeno sa poseda u 16:35 časova bez fizičkog kontakta ili materijalne štete. Incident je u celosti zabeležen na kameri broj 1 u ulaznom lobiju.', 'Prva', 3, '2026-06-26 17:33:41'),
(8, 'Izveštaj - Prva smena', 'Tokom prve smene došlo je do vanredne situacije uzrokovane jakim nevremenom koje je zahvatilo grad oko 10:30 časova. Usled jakog vetra polomljena je grana drveta u dvorištu koja je pala na stazu ispred sporednog ulaza, a uočeno je i manje prodiranje vode kroz prozor u podrumskim prostorijama magacina B. Odmah sam obavestio domara koji je privremeno sanirao prozor i zatvorio sporedni ulaz dok se grana ne ukloni, a niko od zaposlenih i posetilaca nije povređen.', 'Prva', 3, '2026-06-27 17:36:23'),
(10, 'Izveštaj - Prva smena', 'Današnja prva smena je protekla mirno i radno, a glavni događaj bio je dolazak angažovanih majstora za servisiranje liftova. Ekipa od dva radnika iz ovlašćene firme stigla je u 08:30 časova, uredno su legitimisani i upisani u evidenciju, nakon čega su im izdate privremene propusnice i omogućen im je pristup tehničkim prostorijama. Radovi na glavnom liftu su uspešno završeni oko 12:15 časova, radnici su vratili propusnice i napustili objekat, a lift je ponovo pušten u redovnu upotrebu. Ostatak smene je protekao uobičajeno, bez gužvi na prijavnici i bez ikakvih problema sa bezbednosnim sistemima, a dežurstvo je uredno predate kolegi u 14:00 časova.', 'Druga', 3, '2026-05-27 17:46:15');

-- --------------------------------------------------------

--
-- Table structure for table `komentar`
--

CREATE TABLE `komentar` (
  `id` int(11) NOT NULL,
  `obavestenje_id` int(11) NOT NULL,
  `autor_id` int(11) NOT NULL,
  `tekst` text NOT NULL,
  `datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `komentar`
--

INSERT INTO `komentar` (`id`, `obavestenje_id`, `autor_id`, `tekst`, `datum`) VALUES
(3, 34, 111, 'dolazim', '2026-06-30 20:42:34'),
(4, 34, 104, 'i ja', '2026-06-30 20:43:23');

-- --------------------------------------------------------

--
-- Table structure for table `korisnik`
--

CREATE TABLE `korisnik` (
  `id` int(11) NOT NULL,
  `ime` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `sifra` varchar(100) NOT NULL,
  `tip` enum('student','admin','upravnik','majstor','portir') NOT NULL,
  `vreme_kreiranja` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `korisnik`
--

INSERT INTO `korisnik` (`id`, `ime`, `email`, `sifra`, `tip`, `vreme_kreiranja`) VALUES
(1, 'Jagodica Admin', 'jagodicabooobicaaa@gmail.com', 'jagodicabobica456', 'admin', '2026-06-17 13:16:51'),
(2, 'Nikola Upravnik', 'nikolanesic80@gmail.com', 'nemasifra1', 'upravnik', '2026-06-17 13:16:51'),
(3, 'Dragan Portir', 'dragan1970@gmail.com', 'marica1973', 'portir', '2026-06-17 13:16:51'),
(4, 'Marija Jovic', 'maaarijaa@gmail.com', 'student123', 'student', '2026-06-17 13:16:51'),
(5, 'Sofija Stefanovic', 'soffistef@gmail.com', 'sofi456', 'student', '2026-06-17 13:16:51'),
(6, 'Mile Majstor', 'mile.majstor@gmail.com', 'milemajstor1', 'majstor', '2026-06-17 13:16:51'),
(100, 'Ana Ilic', 'ana100@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(101, 'Marko Nikolic', 'marko101@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(102, 'Jovana Jovanovic', 'jovana102@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(103, 'Petar Petrovic', 'petar103@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(104, 'Milica Stojanovic', 'milica104@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(105, 'Nikola Djordjevic', 'nikola105@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(106, 'Jelena Pavlovic', 'jelena106@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(107, 'Stefan Milanovic', 'stefan107@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(108, 'Marija Popovic', 'marija108@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(109, 'Luka Ilic', 'luka109@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(110, 'Nevena Nikolic', 'nevena110@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(111, 'Filip Jovanovic', 'filip111@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(112, 'Katarina Petrovic', 'katarina112@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(113, 'Aleksandar Stojanovic', 'aleksandar113@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(114, 'Teodora Djordjevic', 'teodora114@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(115, 'Milos Pavlovic', 'milos115@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(116, 'Sara Milanovic', 'sara116@gmail.com', 'student', 'student', '2026-06-18 14:39:25'),
(117, 'Nemanja Popovic', 'nemanja117@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(118, 'Andjela Ilic', 'andjela118@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(119, 'Lazar Nikolic', 'lazar119@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(120, 'Tijana Jovanovic', 'tijana120@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(121, 'Uros Petrovic', 'uros121@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(122, 'Ivana Stojanovic', 'ivana122@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(123, 'Ognjen Djordjevic', 'ognjen123@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(124, 'Milana Pavlovic', 'milana124@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(125, 'Djordje Milanovic', 'djordje125@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(126, 'Tamara Popovic', 'tamara126@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(127, 'Vuk Ilic', 'vuk127@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(128, 'Sanja Nikolic', 'sanja128@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(129, 'Jovan Jovanovic', 'jovan129@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(130, 'Nina Petrovic', 'nina130@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(131, 'Milan Stojanovic', 'milan131@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(132, 'Ksenija Djordjevic', 'ksenija132@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(133, 'Bogdan Pavlovic', 'bogdan133@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(134, 'Jelisaveta Milanovic', 'jelisaveta134@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(135, 'Igor Popovic', 'igor135@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(136, 'Dragana Ilic', 'dragana136@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(137, 'Ilija Nikolic', 'ilija137@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(138, 'Ruzica Jovanovic', 'ruzica138@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(139, 'Bojan Petrovic', 'bojan139@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(140, 'Iva Stojanovic', 'iva140@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(141, 'Vukasin Djordjevic', 'vukasin141@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(142, 'Sofija Pavlovic', 'sofija142@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(143, 'Strahinja Milanovic', 'strahinja143@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(144, 'Anja Popovic', 'anja144@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(145, 'Pavle Ilic', 'pavle145@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(146, 'Dunja Nikolic', 'dunja146@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(147, 'Matija Jovanovic', 'matija147@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(148, 'Tara Petrovic', 'tara148@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(149, 'Viktor Stojanovic', 'viktor149@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
(17581, 'Kristina Vuckovic', 'kristinaa@gmail.com', 'tina123', 'student', '2026-06-18 16:34:04'),
(17582, 'milica mitic', 'milicamitic@gmail.com', 'student123', 'student', '2026-06-24 20:13:29'),
(17583, 'ognjen', 'ognjen@gmail.com', 'student123', 'student', '2026-06-25 23:57:00'),
(17584, 'ognjen ognjen', 'ognjen555@gmail.com', 'student123', 'student', '2026-06-25 23:58:12'),
(17585, 'ognjen ognjen', 'ognjen67@gmail.com', 'student123', 'student', '2026-06-25 23:59:50');

-- --------------------------------------------------------

--
-- Table structure for table `kvar`
--

CREATE TABLE `kvar` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) NOT NULL,
  `majstor_id` int(11) DEFAULT NULL,
  `vrsta_kvara` varchar(100) NOT NULL,
  `lokacija` varchar(50) NOT NULL,
  `opis` text DEFAULT NULL,
  `status` enum('na čekanju','zakazano','završeno') NOT NULL DEFAULT 'na čekanju',
  `datum_prijave` datetime DEFAULT current_timestamp(),
  `datum_popravke` datetime DEFAULT NULL,
  `datum_zakazivanja` datetime DEFAULT NULL,
  `vreme_zakazivanja` datetime DEFAULT NULL,
  `broj_izmena` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kvar`
--

INSERT INTO `kvar` (`id`, `korisnik_id`, `majstor_id`, `vrsta_kvara`, `lokacija`, `opis`, `status`, `datum_prijave`, `datum_popravke`, `datum_zakazivanja`, `vreme_zakazivanja`, `broj_izmena`) VALUES
(65, 4, NULL, 'Elektrika (svetla, utičnice...)', '125', 'Poštovani, pišem Vam kako bih prijavio problem sa utičnicom koja se nalazi pored radnog stola sa desne strane prozora. Primetio sam da je popustila iz zida i da varniči kada pokušam da uključim punjač za laptop, pa je trenutno uopšte ne koristimo iz bezbednosnih razloga. Molim Vas da pogledate ovo što pre jer nam je ta utičnica neophodna za učenje.', 'završeno', '2026-06-30 20:01:51', '2026-06-30 20:43:58', '2026-07-01 09:00:00', '2026-06-30 20:08:03', 1),
(66, 4, NULL, 'Stolarija (vrata, prozori...)', '205', 'Pozdrav, uočili smo problem sa curenjem vode u kupatilu ispod lavaboa. Izgleda da je plastični sifon napukao jer se pri svakom puštanju vode stvara velika bara na pločicama. Postavili smo plastičnu posudu ispod kako bismo privremeno skupljali vodu, ali bi bilo super ako možete da dođete i zamenite cev ili gumicu.', 'završeno', '2026-06-30 20:02:44', '2026-06-30 20:43:59', '2026-07-02 09:00:00', '2026-06-30 20:08:08', 1),
(67, 111, NULL, 'Stolarija (vrata, prozori...)', '415', 'Poštovani, potreban nam je majstor za stolariju jer je mehanizam na levom prozoru blokirao. Prozor je ostao zaglavljen na kip i ne može uopšte da se zatvori do kraja niti da se vrati u početni položaj. Kako najavljuju kišu i vetar, plašimo se da će nam voda ući u sobu pa bi bilo dobro da se ovo sanira tokom dana.', 'završeno', '2026-06-30 20:06:19', '2026-06-30 20:44:03', '2026-07-03 09:00:00', '2026-06-30 20:08:16', 1),
(68, 111, NULL, 'Grejanje', '415', 'Dobar dan, prijavljujem kvar na grejanju u sobi broj 208. Radijator je potpuno hladan iako je ventil odvrnut do kraja, a iz cevi se povremeno čuje jako klokotanje vode. Pretpostavljam da je potrebno samo da se ispusti vazduh iz sistema jer je u susednim sobama grejanje u redu, a kod nas je postalo prilično hladno.', 'završeno', '2026-06-30 20:06:32', '2026-06-30 20:44:01', '2026-07-04 09:00:00', '2026-06-30 20:08:20', 1),
(69, 104, NULL, 'Stolarija (vrata, prozori...)', '155', 'Poštovani, pišem u ime kolege i sebe kako bismo prijavili oštećenje na desnom krevetu. Tokom večeri su pukle dve drvene letvice koje drže dušek na sredini kreveta, zbog čega je spavanje sada nemoguće jer dušek propada. Krevet je starije proizvodnje pa verujem da je drvo jednostavno dotrajalo i da je potrebna zamena tih letvica.', 'završeno', '2026-06-30 20:06:54', '2026-06-30 20:44:04', '2026-07-05 09:00:00', '2026-06-30 20:08:24', 1),
(70, 116, NULL, 'Stolarija (vrata, prozori...)', '22', 'Pozdrav, imamo veliki problem sa ulaznim vratima sobe jer ključ užasno teško ulazi u bravu i jedva uspevamo da ga okrenemo. Danas smo ostali zaglavljeni ispred vrata skoro deset minuta pre nego što je cilindar konačno popustio. Molimo Vas da zamenite bravu ili je podmažete kako ne bismo morali da zovemo portira u pomoć ako ostanemo zaključani.', 'završeno', '2026-06-30 20:07:48', '2026-06-30 20:44:06', '2026-07-01 13:00:00', '2026-06-30 20:08:41', 1),
(71, 111, NULL, 'Elektrika (svetla, utičnice...)', '4', '', 'zakazano', '2026-06-30 20:18:22', NULL, '2026-07-01 11:05:00', '2026-06-30 23:34:53', 1),
(72, 4, NULL, 'Elektrika (svetla, utičnice...)', '245', '\"Poštovani, pišem Vam kako bih prijavio problem sa utičnicom koja se nalazi pored radnog stola sa desne strane prozora. Primetio sam da je popustila iz zida i da varniči kada pokušam da uključim punjač za laptop, pa je trenutno uopšte ne koristimo iz bezbednosnih razloga. Molim Vas da pogledate ovo što pre jer nam je ta utičnica neophodna za učenje.\"', 'zakazano', '2026-07-01 13:53:48', NULL, '2026-07-01 14:00:00', '2026-07-01 13:54:06', 1),
(73, 116, NULL, 'Vodovod (cevi, slavine...)', '5', '\"Poštovani, pišem Vam kako bih prijavio problem sa utičnicom koja se nalazi pored radnog stola sa desne strane prozora. Primetio sam da je popustila iz zida i da varniči kada pokušam da uključim punjač za laptop, pa je trenutno uopšte ne koristimo iz bezbednosnih razloga. Molim Vas da pogledate ovo što pre jer nam je ta utičnica neophodna za učenje.\"', 'zakazano', '2026-07-01 13:54:35', NULL, '2026-07-04 09:00:00', '2026-07-01 13:55:58', 1),
(74, 116, NULL, 'Elektrika (svetla, utičnice...)', '55', '\"Poštovani, pišem Vam kako bih prijavio problem sa utičnicom koja se nalazi pored radnog stola sa desne strane prozora. Primetio sam da je popustila iz zida i da varniči kada pokušam da uključim punjač za laptop, pa je trenutno uopšte ne koristimo iz bezbednosnih razloga. Molim Vas da pogledate ovo što pre jer nam je ta utičnica neophodna za učenje.\"', 'zakazano', '2026-07-01 13:54:41', NULL, '2026-07-03 09:00:00', '2026-07-01 13:55:52', 1),
(75, 116, NULL, 'Elektrika (svetla, utičnice...)', '8', '\"Poštovani, pišem Vam kako bih prijavio problem sa utičnicom koja se nalazi pored radnog stola sa desne strane prozora. Primetio sam da je popustila iz zida i da varniči kada pokušam da uključim punjač za laptop, pa je trenutno uopšte ne koristimo iz bezbednosnih razloga. Molim Vas da pogledate ovo što pre jer nam je ta utičnica neophodna za učenje.\"\n', 'završeno', '2026-07-01 13:54:49', '2026-07-01 14:55:04', '2026-07-01 17:00:00', '2026-07-01 13:55:23', 1),
(76, 116, NULL, 'Grejanje', '55', 'wihdasiojdoias', 'na čekanju', '2026-07-01 14:52:17', NULL, NULL, NULL, 0),
(77, 116, NULL, 'Stolarija (vrata, prozori...)', '656', 'skljslxj', 'zakazano', '2026-07-01 14:52:35', NULL, '2026-07-02 14:55:00', '2026-07-01 14:53:49', 1),
(78, 116, NULL, 'Grejanje', '65', 'sjksj', 'zakazano', '2026-07-01 15:32:14', NULL, '2026-07-02 09:00:00', '2026-07-01 15:32:50', 1),
(79, 3, NULL, 'Vodovod (cevi, slavine...)', 'hodnik 1. sprat', 'Poštovani, potreban nam je majstor za stolariju jer je mehanizam na levom prozoru blokirao. Prozor je ostao zaglavljen na kip i ne može uopšte da se zatvori do kraja niti da se vrati u početni položaj. Kako najavljuju kišu i vetar, plašimo se da će nam voda ući u sobu pa bi bilo dobro da se ovo sanira tokom dana.', 'završeno', '2026-07-01 16:28:23', '2026-07-01 16:28:48', '2026-07-01 17:00:00', '2026-07-01 16:28:37', 1),
(80, 117, NULL, 'Elektrika (svetla, utičnice...)', '4', '', 'zakazano', '2026-07-01 16:36:38', NULL, '2026-07-01 16:40:00', '2026-07-01 16:36:55', 1),
(81, 117, NULL, 'Vodovod (cevi, slavine...)', '4', '', 'završeno', '2026-07-01 16:37:05', '2026-07-01 16:37:34', '2026-07-22 09:00:00', '2026-07-01 16:37:18', 1),
(82, 111, NULL, 'Stolarija (vrata, prozori...)', '7', '', 'zakazano', '2026-07-01 16:40:15', NULL, '2026-07-01 16:45:00', '2026-07-01 16:40:38', 1);

-- --------------------------------------------------------

--
-- Table structure for table `majstor`
--

CREATE TABLE `majstor` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) NOT NULL,
  `jmbg` varchar(13) NOT NULL,
  `telefon` varchar(20) NOT NULL,
  `pocetak_rada` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `majstor`
--

INSERT INTO `majstor` (`id`, `korisnik_id`, `jmbg`, `telefon`, `pocetak_rada`) VALUES
(1, 6, '1205980778889', '0641112223', '2015-05-01');

-- --------------------------------------------------------

--
-- Table structure for table `obavestenje`
--

CREATE TABLE `obavestenje` (
  `id` int(11) NOT NULL,
  `naziv` varchar(200) NOT NULL,
  `tekst` text NOT NULL,
  `tip` enum('vazno','obicno') NOT NULL DEFAULT 'obicno',
  `autor_id` int(11) NOT NULL,
  `datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `obavestenje`
--

INSERT INTO `obavestenje` (`id`, `naziv`, `tekst`, `tip`, `autor_id`, `datum`) VALUES
(5, 'Useljenje 25/26', 'Obaveštavaju se svi studenti koji su ostvarili pravo na smeštaj u studentskom domu za narednu školsku godinu da useljenje zvanično počinje 1. oktobra.\r\n\r\nMolimo vas da se striktno pridržavate rasporeda po azbučnom redu i spratovima koji je istaknut na oglasnoj tabli na portirnici, kako bismo izbegli gužve. Sa sobom obavezno poneti: indeks, ličnu kartu, lekarsko uverenje (ne starije od 30 dana) i dve slike. Useljenje van predviđenog termina biće moguće isključivo uz pismenu najavu i opravdanje uprave.', 'vazno', 2, '2025-09-21 21:41:16'),
(6, 'Hitni elektro-radovi i privremeni nestanak struje u Bloku B', 'Zbog vanrednih radova na elektromreži i zamene glavnih osigurača, u četvrtak, 18. decembra, u periodu od 09:00h do 13:00h, ceo Blok B će biti bez električne energije.\r\n\r\nMolimo studente da u ovom periodu ne koriste liftove i da isključe osetljive elektronske uređaje (računare, punjače) iz utičnica kako bi se izbegli kvarovi prilikom ponovnog puštanja struje. Čitaonica na prvom spratu će raditi nesmetano jer je povezana na rezervni agregat. Hvala na razumevanju.', 'vazno', 2, '2025-12-16 21:45:07'),
(9, 'Obavezna redovna dezinsekcija i deratizacija svih soba', 'Obaveštavamo stanare da će se tokom predstojećeg vikenda obaviti redovna i obavezna dezinsekcija i deratizacija svih studentskih soba, zajedničkih kupatila i čitaonica.\r\n\r\nRaspored po spratovima:\r\nSubota od 08:00h: Spratovi 1, 2 i 3\r\nNedelja od 08:00h: Spratovi 4, 5 i potkrovlje\r\n\r\nPrisustvo jednog od stanara u sobi je obavezno tokom posete ekipe za dezinfekciju. Molimo vas da oslobodite prilaze uglovima soba i sklonite hranu sa stolova.', 'vazno', 2, '2026-03-03 09:48:52'),
(10, 'Pojačan režim tišine i korigovano vreme poseta tokom ispitnog roka', 'S obzirom na to da je ispitni rok u punom jeku, uprava doma uvodi pojačan režim tišine radi omogućavanja nesmetanog učenja i odmora svim stanarima.\r\n\r\nOd danas pa sve do 15. juna, vreme za odmor i apsolutnu tišinu važi od 14:00h do 17:00h i od 22:00h do 07:00h sutradan. Sve posete u sobama moraju se završiti najkasnije do 21:00h. Svako kršenje kućnog reda, preglasna muzika ili galama u hodnicima biće strogo sankcionisani disciplinskim merama i gubitkom prava na dom. Srećno na ispitima!', 'vazno', 2, '2026-06-11 21:49:57'),
(14, 'Uspešno otklonjen kvar na veš mašini (drugi sprat)', 'Obaveštavaju se studenti da je kvar na veš mašini na drugom spratu uspešno otklonjen od strane tehničke službe.Mašina je detaljno testirana, potpuno je ispravna i vraćena je u funkciju. Rezervacija termina za pranje veša od sada se može vršiti redovno.\nMolimo sve stanare da mašinu koriste pažljivo, da ne prekoračuju dozvoljenu količinu veša i da se striktno pridržavaju uputstva za rad kako bismo izbegli nove kvarove i zastoje. Hvala na razumevanju.', 'vazno', 3, '2026-06-25 19:59:48'),
(17, 'Nestanak struje u Bloku A?', 'Ljudi, da li je još nekome nestala struja u Bloku A na trećem spratu ili je samo u mojoj sobi iskočio osigurač? Ako neko može da proveri hodnik i javi, da znam da li da zovem domara ili ne. Hvala!', 'obicno', 134, '2025-01-22 20:18:05'),
(19, 'Pronadjena studentska kartica', 'Pronašao sam karticu za menzu na stazi između drugog bloka i glavnog ulaza. Kartica je na ime Milan Jovanović. Ostavio sam je kod portira na glavnoj portirnici, pa ako neko poznaje dečka neka mu javi da ga čeka tamo.', 'obicno', 129, '2026-03-22 20:19:46'),
(26, 'Kakva je situacija sa gužvom u menzi?', 'Ljudi, da li je neko išao skoro na ručak oko pola 2, koliki je red ispred menze? Prošli put sam čekao bukvalno pola sata na suncu, pa me zanima da li se raščistilo malo ili da pomerim ručak za kasnije dok ne prođe najveći talas.', 'obicno', 145, '2026-06-28 13:15:22'),
(27, 'Izgubljen ključ sa crvenim priveskom', 'Ćao svima, izgleda da sam negde između čitaonice i drugog bloka izgubila ključ od sobe koji ima crveni gumeni privezak u obliku patike. Ako ga je neko pronašao ili ga video na prijavnici, molim vas da mi javi ovde u komentarima jer ne bih baš da plaćam zamenu brave portirima.', 'obicno', 144, '2026-06-28 17:40:11'),
(28, 'Da li radi klima u velikoj čitaonici?', 'Pozdrav, planiram večeras da ostanem duže da učim, pa me zanima da li je neko u velikoj čitaonici i da li su popravili klimu? Prošlog puta je bilo pretoplo i zagušljivo, pa me zanima vredi li uopšte dolaziti sa knjigama ili da ostanem u sobi.', 'obicno', 146, '2026-06-29 11:22:05'),
(29, 'Basket na terenima doma od 18h', 'Treba nam još dvoje ljudi za basket danas popodne oko 18 časova na spoljnim terenima doma. Skupili smo se nas četvorica sa sprata, igramo čisto rekreativno i opušteno pa ako je neko slobodan i želi da se malo odmori od učenja neka se javi.', 'obicno', 147, '2026-06-29 14:55:00'),
(30, 'Molba za malo više tišine na četvrtom spratu', 'Kolege sa četvrtog sprata, svesna sam da je junski ispitni rok pri kraju i da su neki već završili obaveze, ali molim vas imajte obzira prema nama koji još uvek spremamo ispite. Muzika i galama u hodniku posle 22h stvarno otežavaju spavanje i koncentraciju, hvala na razumevanju.', 'obicno', 148, '2026-06-29 22:40:18'),
(31, 'Slobodan termin za pranje veša večeras', 'Ako nekome hitno treba, oslobodiću svoj termin za korišćenje veš mašine večeras od 21:00 jer neću stići da pokupim stvari iz sobe na vreme. Možete slobodno da rezervišete preko aplikacije čim otkažem, nadam se da će nekome značiti.', 'obicno', 149, '2026-06-30 10:05:33'),
(32, 'Poklanjam skripte iz sociologije i ekonomije', 'Pošto sam konačno očistila godinu, poklanjam kompletno odštampane skripte i podvučene beleške iz sociologije i osnova ekonomije. Meni više ne trebaju, a nekome od mlađih kolega mogu dobro doći za sledeći rok, pa ko se prvi javi njegove su.', 'obicno', 17581, '2026-06-30 12:30:14'),
(33, 'Problem sa DomNet Wi-Fi mrežom u Bloku B', 'Da li još nekome u Bloku B večeras konstantno puca domski internet? Stalno me diskonektuje sa mreže na svakih pet minuta, a signal na telefonu pokazuje da je pun, pa ne znam da li je problem do mog rutera u hodniku ili je generalni prekid u celom bloku.', 'obicno', 17582, '2026-06-30 19:45:12'),
(34, 'Veče društvenih igara u TV sali', 'Planiramo sutra uveče oko osam da se skupimo u TV sali i igramo Monopol i Riziko. Imamo par igara, ali ako neko ima još nešto zanimljivo slobodno neka ponese, svi su dobrodošli da dođu da se malo podružimo i skrenemo misli sa predstojećih rezultata.', 'obicno', 17583, '2026-06-30 20:12:00');

-- --------------------------------------------------------

--
-- Table structure for table `portir`
--

CREATE TABLE `portir` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) NOT NULL,
  `jmbg` varchar(13) NOT NULL,
  `telefon` varchar(20) NOT NULL,
  `pocetak_rada` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `portir`
--

INSERT INTO `portir` (`id`, `korisnik_id`, `jmbg`, `telefon`, `pocetak_rada`) VALUES
(1, 3, '2303970446663', '0612345678', '2019-04-23');

-- --------------------------------------------------------

--
-- Table structure for table `reakcija`
--

CREATE TABLE `reakcija` (
  `id` int(11) NOT NULL,
  `obavestenje_id` int(11) NOT NULL,
  `autor_id` int(11) NOT NULL,
  `tip_reakcije` enum('lajk','love','think','haha','sad') NOT NULL DEFAULT 'lajk',
  `datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reakcija`
--

INSERT INTO `reakcija` (`id`, `obavestenje_id`, `autor_id`, `tip_reakcije`, `datum`) VALUES
(3, 17, 4, 'lajk', '2026-06-30 20:00:24'),
(4, 27, 111, 'lajk', '2026-06-30 20:41:45'),
(5, 17, 111, 'lajk', '2026-06-30 20:41:46'),
(6, 19, 111, 'lajk', '2026-06-30 20:41:47'),
(7, 26, 111, 'lajk', '2026-06-30 20:41:48'),
(8, 29, 111, 'lajk', '2026-06-30 20:41:49'),
(9, 28, 111, 'lajk', '2026-06-30 20:41:50'),
(12, 33, 111, 'lajk', '2026-06-30 20:41:56'),
(13, 30, 111, 'lajk', '2026-06-30 20:41:57'),
(14, 31, 111, 'lajk', '2026-06-30 20:41:58'),
(15, 32, 111, 'lajk', '2026-06-30 20:41:59'),
(18, 34, 111, 'lajk', '2026-06-30 20:42:16'),
(19, 34, 4, 'lajk', '2026-07-01 13:52:39');

-- --------------------------------------------------------

--
-- Table structure for table `rezervacija`
--

CREATE TABLE `rezervacija` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `masina_id` int(11) NOT NULL,
  `datum` date NOT NULL,
  `slot` int(11) NOT NULL,
  `portir_id` int(11) DEFAULT NULL,
  `status` enum('na cekanju','odobreno','odbijeno') DEFAULT 'na cekanju',
  `datum_zahteva` datetime DEFAULT current_timestamp(),
  `datum_odgovora` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rezervacija`
--

INSERT INTO `rezervacija` (`id`, `student_id`, `masina_id`, `datum`, `slot`, `portir_id`, `status`, `datum_zahteva`, `datum_odgovora`) VALUES
(1, 3, 1, '2026-06-25', 1, NULL, 'odobreno', '2026-06-21 02:09:21', '2026-06-21 02:19:55'),
(2, 1, 2, '2026-06-22', 3, NULL, 'odobreno', '2026-06-21 16:21:06', '2026-06-21 16:21:50'),
(3, 1, 3, '2026-06-26', 5, NULL, 'odobreno', '2026-06-21 17:03:46', '2026-06-21 17:06:00'),
(4, 1, 4, '2026-06-30', 5, NULL, 'odobreno', '2026-06-21 17:05:01', '2026-06-21 17:05:59'),
(5, 1, 2, '2026-07-03', 5, NULL, 'odobreno', '2026-06-21 18:25:29', '2026-06-21 18:36:41'),
(6, 1, 2, '2026-07-03', 4, NULL, 'odobreno', '2026-06-21 18:25:35', '2026-06-21 18:25:54'),
(7, 1, 2, '2026-06-30', 1, NULL, 'odobreno', '2026-06-21 18:33:50', '2026-06-21 18:37:06'),
(8, 1, 2, '2026-06-25', 2, NULL, 'odobreno', '2026-06-21 18:35:35', '2026-06-21 18:36:58'),
(9, 1, 3, '2026-06-25', 1, NULL, 'odobreno', '2026-06-21 18:43:54', '2026-06-21 18:52:51'),
(10, 1, 1, '2026-06-27', 3, NULL, 'odobreno', '2026-06-21 18:47:35', '2026-06-21 18:49:33'),
(11, 1, 4, '2026-06-30', 4, NULL, 'odobreno', '2026-06-21 18:47:53', '2026-06-21 18:49:47'),
(12, 1, 4, '2026-06-24', 5, NULL, 'odobreno', '2026-06-21 18:50:38', '2026-06-21 18:50:56'),
(13, 1, 2, '2026-06-30', 4, NULL, 'odbijeno', '2026-06-21 18:54:44', '2026-06-21 18:54:48'),
(14, 1, 2, '2026-06-29', 4, NULL, 'odbijeno', '2026-06-21 18:55:09', '2026-06-21 18:55:16'),
(15, 1, 1, '2026-06-23', 4, NULL, 'odobreno', '2026-06-21 19:09:34', '2026-06-21 19:16:55'),
(16, 1, 2, '2026-06-25', 4, NULL, 'odobreno', '2026-06-21 19:09:44', '2026-06-21 19:09:51'),
(17, 1, 2, '2026-06-25', 3, NULL, 'odobreno', '2026-06-21 19:16:23', '2026-06-21 19:17:08'),
(18, 6, 2, '2026-07-08', 3, NULL, 'odbijeno', '2026-06-21 21:47:36', '2026-06-21 21:47:57'),
(19, 6, 2, '2026-06-30', 3, NULL, 'odobreno', '2026-06-21 21:50:25', '2026-06-21 22:02:58'),
(20, 6, 1, '2026-06-29', 1, NULL, 'odobreno', '2026-06-21 21:53:27', '2026-06-21 23:27:19'),
(21, 6, 4, '2026-06-22', 1, NULL, 'odobreno', '2026-06-21 21:53:48', '2026-06-21 23:27:18'),
(22, 6, 2, '2026-07-12', 4, NULL, 'odobreno', '2026-06-21 21:57:02', '2026-06-21 22:02:55'),
(23, 6, 3, '2026-07-03', 5, NULL, 'odobreno', '2026-06-21 22:17:45', '2026-06-21 23:27:16'),
(24, 6, 1, '2026-06-24', 3, NULL, 'odobreno', '2026-06-21 22:31:54', '2026-06-21 23:27:21'),
(25, 2, 3, '2026-06-25', 3, NULL, 'odobreno', '2026-06-21 23:25:37', '2026-06-21 23:27:15'),
(26, 12, 1, '2026-06-25', 3, NULL, 'odobreno', '2026-06-21 23:31:07', '2026-06-30 19:47:20'),
(27, 1, 3, '2026-07-01', 3, NULL, 'odobreno', '2026-06-23 16:40:50', '2026-06-30 19:47:21'),
(28, 7, 1, '2026-06-27', 2, NULL, 'odobreno', '2026-06-25 19:57:01', '2026-06-25 20:00:38'),
(29, 7, 4, '2026-06-30', 3, NULL, 'odobreno', '2026-06-25 20:14:07', '2026-06-30 15:39:58'),
(30, 7, 3, '2026-06-26', 2, NULL, 'odobreno', '2026-06-25 23:54:29', '2026-06-25 23:54:58'),
(31, 7, 2, '2026-06-28', 2, NULL, 'odbijeno', '2026-06-25 23:55:33', '2026-06-25 23:55:45'),
(32, 7, 1, '2026-06-30', 3, NULL, 'odobreno', '2026-06-27 01:53:12', '2026-06-27 01:54:02'),
(33, 3, 3, '2026-06-30', 2, NULL, 'odobreno', '2026-06-27 02:10:34', '2026-06-30 19:47:23'),
(34, 1, 1, '2026-07-05', 3, NULL, 'odobreno', '2026-06-27 02:12:24', '2026-06-27 02:12:35'),
(35, 1, 2, '2026-07-02', 3, NULL, 'odobreno', '2026-06-28 19:50:53', '2026-07-01 14:08:13'),
(36, 14, 3, '2026-07-01', 2, NULL, 'na cekanju', '2026-06-30 16:46:04', NULL),
(37, 14, 3, '2026-07-05', 2, NULL, 'na cekanju', '2026-06-30 16:46:43', NULL),
(38, 14, 2, '2026-07-03', 3, NULL, 'odobreno', '2026-06-30 20:19:33', '2026-07-01 16:38:09'),
(39, 19, 3, '2026-07-02', 2, NULL, 'odobreno', '2026-07-01 14:49:41', '2026-07-01 14:50:00'),
(40, 20, 1, '2026-07-16', 4, NULL, 'odobreno', '2026-07-01 16:37:45', '2026-07-01 16:38:05');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) NOT NULL,
  `jmbg` varchar(13) NOT NULL,
  `telefon` varchar(20) NOT NULL,
  `br_indexa` varchar(20) NOT NULL,
  `br_sobe` int(11) DEFAULT NULL,
  `fakultet` varchar(255) DEFAULT NULL,
  `smer` varchar(255) DEFAULT NULL,
  `datum_useljenja` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `korisnik_id`, `jmbg`, `telefon`, `br_indexa`, `br_sobe`, `fakultet`, `smer`, `datum_useljenja`) VALUES
(1, 4, '1809002336664', '0647897889', '16896', 413, 'masinski', 'inzenjerski menadzment', '2022-02-03'),
(2, 5, '0106004444444', '0641234569', '19943', 244, 'elektronski', 'racunarstvo i informatika', '2023-04-01'),
(3, 100, '0101001710001', '5656', '15000', 101, 'elektronski', 'računarstvo i informatika', '2023-10-01'),
(4, 101, '0201001710002', '0601112201', '15001', 101, 'masinski', 'proizvodno mašinstvo', '2023-10-01'),
(5, 102, '0301001710003', '0601112202', '15002', 101, 'medicinski', 'opšta medicina', '2023-10-01'),
(6, 103, '0401001710004', '0601112203', '15003', 102, 'pravni', 'opšte pravo', '2023-10-01'),
(7, 104, '0501001710005', '0601112204', '15004', 102, 'ekonomski', 'finansije', '2023-10-01'),
(8, 105, '0601001710006', '0601112205', '15005', 102, 'filozofski', 'psihologija', '2023-10-01'),
(9, 106, '0701001710007', '0601112206', '15006', 103, 'elektronski', 'elektronika', '2023-10-01'),
(10, 107, '0801001710008', '0601112207', '15007', 103, 'masinski', 'termoenergetika', '2023-10-01'),
(11, 108, '0901001710009', '0601112208', '15008', 103, 'medicinski', 'stomatologija', '2023-10-01'),
(12, 109, '1001001710010', '0601112209', '15009', 104, 'pravni', 'poslovno pravo', '2023-10-01'),
(13, 110, '1101001710011', '0601112210', '15010', 104, 'ekonomski', 'marketing', '2023-10-01'),
(14, 111, '1201001710012', '0601112211', '15011', 104, 'filozofski', 'sociologija', '2023-10-01'),
(15, 112, '1301001710013', '0601112212', '15012', 105, 'elektronski', 'telekomunikacije', '2023-10-01'),
(16, 113, '1401001710014', '4', '4', 4, '4', '4', '2023-10-01'),
(17, 114, '1501001710015', '0601112214', '15014', 105, 'medicinski', 'farmacija', '2023-10-01'),
(18, 115, '1601001710016', '0601112215', '15015', 106, 'pravni', 'krivično pravo', '2023-10-01'),
(19, 116, '1701001710017', '0601112216', '15016', 106, 'ekonomski', 'menadžment', '2023-10-01'),
(20, 117, '1801001710018', '0601112217', '15017', 106, 'filozofski', 'istorija', '2023-10-01'),
(21, 118, '1901001710019', '0601112218', '15018', 107, 'elektronski', 'računarstvo i informatika', '2023-10-01'),
(22, 119, '2001001710020', '0601112219', '15019', 107, 'masinski', 'proizvodno mašinstvo', '2023-10-01'),
(23, 120, '2101001710021', '0601112220', '15020', 107, 'medicinski', 'opšta medicina', '2023-10-01'),
(24, 121, '2201001710022', '0601112221', '15021', 108, 'pravni', 'opšte pravo', '2023-10-01'),
(25, 122, '2301001710023', '0601112222', '15022', 108, 'ekonomski', 'finansije', '2023-10-01'),
(26, 123, '2401001710024', '0601112223', '15023', 108, 'filozofski', 'psihologija', '2023-10-01'),
(27, 124, '2501001710025', '0601112224', '15024', 109, 'elektronski', 'elektronika', '2023-10-01'),
(28, 125, '2601001710026', '0601112225', '15025', 109, 'masinski', 'termoenergetika', '2023-10-01'),
(29, 126, '2701001710027', '0601112226', '15026', 109, 'medicinski', 'stomatologija', '2023-10-01'),
(30, 127, '2801001710028', '0601112227', '15027', 110, 'pravni', 'poslovno pravo', '2023-10-01'),
(31, 128, '2901001710029', '0601112228', '15028', 110, 'ekonomski', 'marketing', '2023-10-01'),
(32, 129, '0102001710030', '0601112229', '15029', 110, 'filozofski', 'sociologija', '2023-10-01'),
(33, 130, '0202001710031', '0601112230', '15030', 111, 'elektronski', 'telekomunikacije', '2023-10-01'),
(34, 131, '0302001710032', '0601112231', '15031', 111, 'masinski', 'mehatronika', '2023-10-01'),
(35, 132, '0402001710033', '0601112232', '15032', 111, 'medicinski', 'farmacija', '2023-10-01'),
(36, 133, '0502001710034', '0601112233', '15033', 112, 'pravni', 'krivično pravo', '2023-10-01'),
(37, 134, '0602001710035', '0601112234', '15034', 112, 'ekonomski', 'menadžment', '2023-10-01'),
(38, 135, '0702001710036', '0601112235', '15035', 112, 'filozofski', 'istorija', '2023-10-01'),
(39, 136, '0802001710037', '0601112236', '15036', 113, 'elektronski', 'računarstvo i informatika', '2023-10-01'),
(40, 137, '0902001710038', '0601112237', '15037', 113, 'masinski', 'proizvodno mašinstvo', '2023-10-01'),
(41, 138, '1002001710039', '0601112238', '15038', 113, 'medicinski', 'opšta medicina', '2023-10-01'),
(42, 139, '1102001710040', '0601112239', '15039', 114, 'pravni', 'opšte pravo', '2023-10-01'),
(43, 140, '1202001710041', '0601112240', '15040', 114, 'ekonomski', 'finansije', '2023-10-01'),
(44, 141, '1302001710042', '0601112241', '15041', 114, 'filozofski', 'psihologija', '2023-10-01'),
(45, 142, '1402001710043', '0601112242', '15042', 115, 'elektronski', 'elektronika', '2023-10-01'),
(46, 143, '1502001710044', '0601112243', '15043', 115, 'masinski', 'termoenergetika', '2023-10-01'),
(47, 144, '1602001710045', '0601112244', '15044', 115, 'medicinski', 'stomatologija', '2023-10-01'),
(48, 145, '1702001710046', '0601112245', '15045', 116, 'pravni', 'poslovno pravo', '2023-10-01'),
(49, 146, '1802001710047', '0601112246', '15046', 116, 'ekonomski', 'marketing', '2023-10-01'),
(50, 147, '1902001710048', '0601112247', '15047', 116, 'filozofski', 'sociologija', '2023-10-01'),
(51, 148, '2002001710049', '0601112248', '15048', 117, 'elektronski', 'telekomunikacije', '2023-10-01'),
(52, 149, '2102001710050', '0601112249', '15049', 117, 'masinski', 'mehatronika', '2023-10-01'),
(53, 17582, '0000000000000', 'N/A', 'N/A', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `termin`
--

CREATE TABLE `termin` (
  `id` int(11) NOT NULL,
  `masina_id` int(11) NOT NULL,
  `datum` date NOT NULL,
  `vreme_od` time NOT NULL,
  `vreme_do` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `termin`
--

INSERT INTO `termin` (`id`, `masina_id`, `datum`, `vreme_od`, `vreme_do`) VALUES
(1, 1, '2026-05-25', '06:00:00', '09:00:00'),
(2, 1, '2026-05-25', '09:30:00', '12:30:00'),
(3, 1, '2026-05-25', '13:00:00', '16:00:00'),
(4, 1, '2026-05-25', '16:30:00', '19:30:00'),
(5, 1, '2026-05-25', '20:00:00', '23:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `upravnik`
--

CREATE TABLE `upravnik` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) NOT NULL,
  `jmbg` varchar(13) NOT NULL,
  `telefon` varchar(20) NOT NULL,
  `sektor` int(11) DEFAULT NULL,
  `broj_kancelarije` int(11) DEFAULT NULL,
  `pocetak_rada` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `upravnik`
--

INSERT INTO `upravnik` (`id`, `korisnik_id`, `jmbg`, `telefon`, `sektor`, `broj_kancelarije`, `pocetak_rada`) VALUES
(1, 2, '1702980223331', '0632564586', 4, 2, '2020-01-10');

-- --------------------------------------------------------

--
-- Table structure for table `ves_masina`
--

CREATE TABLE `ves_masina` (
  `id` int(11) NOT NULL,
  `naziv` varchar(100) NOT NULL,
  `lokacija` enum('prizemlje','prvi sprat','drugi sprat','treci sprat') NOT NULL,
  `status` enum('dostupna','neispravna') DEFAULT 'dostupna'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ves_masina`
--

INSERT INTO `ves_masina` (`id`, `naziv`, `lokacija`, `status`) VALUES
(1, 'Veš mašina 1', 'prizemlje', 'dostupna'),
(2, 'Veš mašina 2', 'prvi sprat', 'dostupna'),
(3, 'Veš mašina 3', 'drugi sprat', 'dostupna'),
(4, 'Veš mašina 4', 'treci sprat', 'dostupna');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `korisnik_id` (`korisnik_id`),
  ADD UNIQUE KEY `jmbg` (`jmbg`),
  ADD UNIQUE KEY `telefon` (`telefon`);

--
-- Indexes for table `izvestaj`
--
ALTER TABLE `izvestaj`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indexes for table `komentar`
--
ALTER TABLE `komentar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`),
  ADD KEY `obavestenje_id` (`obavestenje_id`);

--
-- Indexes for table `korisnik`
--
ALTER TABLE `korisnik`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `kvar`
--
ALTER TABLE `kvar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `majstor_id` (`majstor_id`),
  ADD KEY `fk_kvar_korisnik` (`korisnik_id`);

--
-- Indexes for table `majstor`
--
ALTER TABLE `majstor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `korisnik_id` (`korisnik_id`),
  ADD UNIQUE KEY `jmbg` (`jmbg`),
  ADD UNIQUE KEY `telefon` (`telefon`);

--
-- Indexes for table `obavestenje`
--
ALTER TABLE `obavestenje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indexes for table `portir`
--
ALTER TABLE `portir`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `korisnik_id` (`korisnik_id`),
  ADD UNIQUE KEY `jmbg` (`jmbg`),
  ADD UNIQUE KEY `telefon` (`telefon`);

--
-- Indexes for table `reakcija`
--
ALTER TABLE `reakcija`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `jedinstvena_reakcija` (`obavestenje_id`,`autor_id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indexes for table `rezervacija`
--
ALTER TABLE `rezervacija`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `masina_id` (`masina_id`),
  ADD KEY `portir_id` (`portir_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `korisnik_id` (`korisnik_id`),
  ADD UNIQUE KEY `jmbg` (`jmbg`),
  ADD UNIQUE KEY `telefon` (`telefon`),
  ADD UNIQUE KEY `br_indexa` (`br_indexa`);

--
-- Indexes for table `termin`
--
ALTER TABLE `termin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `masina_id` (`masina_id`);

--
-- Indexes for table `upravnik`
--
ALTER TABLE `upravnik`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `korisnik_id` (`korisnik_id`),
  ADD UNIQUE KEY `jmbg` (`jmbg`),
  ADD UNIQUE KEY `telefon` (`telefon`);

--
-- Indexes for table `ves_masina`
--
ALTER TABLE `ves_masina`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `izvestaj`
--
ALTER TABLE `izvestaj`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `komentar`
--
ALTER TABLE `komentar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `korisnik`
--
ALTER TABLE `korisnik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17587;

--
-- AUTO_INCREMENT for table `kvar`
--
ALTER TABLE `kvar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `majstor`
--
ALTER TABLE `majstor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `obavestenje`
--
ALTER TABLE `obavestenje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `portir`
--
ALTER TABLE `portir`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reakcija`
--
ALTER TABLE `reakcija`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `rezervacija`
--
ALTER TABLE `rezervacija`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `termin`
--
ALTER TABLE `termin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `upravnik`
--
ALTER TABLE `upravnik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ves_masina`
--
ALTER TABLE `ves_masina`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `izvestaj`
--
ALTER TABLE `izvestaj`
  ADD CONSTRAINT `izvestaj_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `komentar`
--
ALTER TABLE `komentar`
  ADD CONSTRAINT `komentar_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `komentar_ibfk_2` FOREIGN KEY (`obavestenje_id`) REFERENCES `obavestenje` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kvar`
--
ALTER TABLE `kvar`
  ADD CONSTRAINT `fk_kvar_korisnik` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kvar_ibfk_2` FOREIGN KEY (`majstor_id`) REFERENCES `majstor` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `majstor`
--
ALTER TABLE `majstor`
  ADD CONSTRAINT `majstor_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `obavestenje`
--
ALTER TABLE `obavestenje`
  ADD CONSTRAINT `obavestenje_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `portir`
--
ALTER TABLE `portir`
  ADD CONSTRAINT `portir_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reakcija`
--
ALTER TABLE `reakcija`
  ADD CONSTRAINT `reakcija_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reakcija_ibfk_2` FOREIGN KEY (`obavestenje_id`) REFERENCES `obavestenje` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rezervacija`
--
ALTER TABLE `rezervacija`
  ADD CONSTRAINT `rezervacija_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  ADD CONSTRAINT `rezervacija_ibfk_2` FOREIGN KEY (`masina_id`) REFERENCES `ves_masina` (`id`),
  ADD CONSTRAINT `rezervacija_ibfk_3` FOREIGN KEY (`portir_id`) REFERENCES `portir` (`id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `termin`
--
ALTER TABLE `termin`
  ADD CONSTRAINT `termin_ibfk_1` FOREIGN KEY (`masina_id`) REFERENCES `ves_masina` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `upravnik`
--
ALTER TABLE `upravnik`
  ADD CONSTRAINT `upravnik_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

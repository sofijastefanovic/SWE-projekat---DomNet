-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 21, 2026 at 03:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
(4, 'Marija Jovic', 'maaarijaa@gmail.com', 'marimari28', 'student', '2026-06-17 13:16:51'),
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
(116, 'Sara Milanovic', 'sara116@gmail.com', 'student123', 'student', '2026-06-18 14:39:25'),
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
(17581, 'Kristina Vuckovic', 'kristinaa@gmail.com', 'tina123', 'student', '2026-06-18 16:34:04');

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
(37, 4, NULL, 'Elektrika (svetla, utičnice...)', '4', '', 'završeno', '2026-06-18 01:43:02', '2026-06-18 01:47:08', '2026-06-25 09:00:00', '2026-06-18 01:43:16', 1),
(38, 4, NULL, 'Elektrika (svetla, utičnice...)', '7', '', 'zakazano', '2026-06-18 01:47:47', NULL, '2026-07-09 09:00:00', '2026-06-18 01:48:08', 1),
(41, 3, NULL, 'Elektrika (svetla, utičnice...)', '4', '', 'završeno', '2026-06-18 02:02:59', '2026-06-18 02:16:31', '2026-06-18 09:00:00', '2026-06-18 02:16:04', 2),
(42, 5, NULL, 'Elektrika (svetla, utičnice...)', '4', '', 'završeno', '2026-06-18 02:08:51', '2026-06-18 02:16:29', '2026-06-25 09:00:00', '2026-06-18 02:09:10', 1),
(43, 3, NULL, 'Vodovod (cevi, slavine...)', '7', '', 'zakazano', '2026-06-18 02:10:31', NULL, '2026-06-18 09:00:00', '2026-06-18 02:13:36', 2),
(45, 3, NULL, 'Elektrika (svetla, utičnice...)', '3', '', 'zakazano', '2026-06-18 13:38:02', NULL, '2026-07-08 09:00:00', '2026-06-18 13:41:56', 1),
(46, 3, NULL, 'Elektrika (svetla, utičnice...)', '5', '', 'na čekanju', '2026-06-18 13:40:19', NULL, NULL, NULL, 0),
(47, 4, NULL, 'Elektrika (svetla, utičnice...)', '5', '', 'zakazano', '2026-06-18 13:51:41', NULL, '2026-06-18 17:00:00', '2026-06-18 13:51:53', 1),
(48, 109, NULL, 'Elektrika (svetla, utičnice...)', '5', '', 'na čekanju', '2026-06-18 15:00:58', NULL, NULL, NULL, 0),
(49, 109, NULL, 'Grejanje', '1', '', 'na čekanju', '2026-06-18 15:03:04', NULL, NULL, NULL, 0),
(50, 111, NULL, 'Stolarija (vrata, prozori...)', '456', '', 'zakazano', '2026-06-18 15:26:29', NULL, '2026-06-27 09:00:00', '2026-06-18 15:26:49', 1),
(51, 17581, NULL, 'Vodovod (cevi, slavine...)', '123', 'curi voda sa cesme', 'na čekanju', '2026-06-20 02:01:12', NULL, NULL, NULL, 0);

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
(1, 3, 1, '2026-06-25', 1, NULL, 'odobreno', '2026-06-21 02:09:21', '2026-06-21 02:19:55');

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
(3, 100, '0101001710001', '0601112200', '15000', 101, 'elektronski', 'računarstvo i informatika', '2023-10-01'),
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
(16, 113, '1401001710014', '0601112213', '15013', 105, 'masinski', 'mehatronika', '2023-10-01'),
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
(52, 149, '2102001710050', '0601112249', '15049', 117, 'masinski', 'mehatronika', '2023-10-01');

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
(1, 'Ves masina 1', 'prizemlje', 'dostupna'),
(2, 'Ves masina 2', 'prvi sprat', 'dostupna'),
(3, 'Ves masina 3', 'drugi sprat', 'dostupna'),
(4, 'Ves masina 4', 'treci sprat', 'dostupna');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `komentar`
--
ALTER TABLE `komentar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `korisnik`
--
ALTER TABLE `korisnik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17582;

--
-- AUTO_INCREMENT for table `kvar`
--
ALTER TABLE `kvar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `majstor`
--
ALTER TABLE `majstor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `obavestenje`
--
ALTER TABLE `obavestenje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `portir`
--
ALTER TABLE `portir`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reakcija`
--
ALTER TABLE `reakcija`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rezervacija`
--
ALTER TABLE `rezervacija`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

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

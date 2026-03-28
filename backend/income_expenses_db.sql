-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Mar 28, 2026 at 07:50 AM
-- Server version: 8.0.45
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `income_expenses_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('income','expense') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`id`, `name`, `type`, `createdAt`) VALUES
(1, 'เงินเดือน', 'income', '2026-03-27 03:52:59.972'),
(2, 'ดอกเบี้ย', 'income', '2026-03-27 03:53:51.096'),
(3, 'ขายของ', 'income', '2026-03-27 03:53:51.098'),
(4, 'รายได้เสริม', 'income', '2026-03-27 03:53:51.099'),
(5, 'โบนัส', 'income', '2026-03-27 03:53:51.100'),
(6, 'ค่าอินเทอร์เน็ต', 'expense', '2026-03-27 03:55:41.581'),
(7, 'ค่าโทรศัพท์', 'expense', '2026-03-27 03:55:41.583'),
(8, 'ค่าน้ำ', 'expense', '2026-03-27 03:55:41.583'),
(9, 'ค่าไฟ', 'expense', '2026-03-27 03:55:41.584'),
(10, 'ที่พัก/ค่าเช่า', 'expense', '2026-03-27 03:55:41.591'),
(11, 'การเดินทาง', 'expense', '2026-03-27 03:55:41.595'),
(12, 'ช้อปปิ้ง', 'expense', '2026-03-27 03:55:41.612'),
(13, 'อาหาร/เครื่องดื่ม', 'expense', '2026-03-27 03:55:41.619');

-- --------------------------------------------------------

--
-- Table structure for table `Transaction`
--

CREATE TABLE `Transaction` (
  `id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('income','expense') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `categoryId` int DEFAULT NULL,
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionDate` date NOT NULL,
  `userId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Transaction`
--

INSERT INTO `Transaction` (`id`, `amount`, `type`, `createdAt`, `categoryId`, `note`, `transactionDate`, `userId`) VALUES
(1, 50000.00, 'income', '2026-03-27 05:12:48.772', 1, '', '2026-03-30', 2),
(2, 500.00, 'expense', '2026-03-27 05:20:06.438', 9, '', '2026-04-01', 2),
(3, 1000.00, 'expense', '2026-03-27 05:22:19.900', 7, 'เปลี่ยนแบตโทรศัพท์', '2026-03-28', 2),
(5, 500.00, 'expense', '2026-03-27 07:41:28.701', 6, '', '2026-03-27', 2),
(6, 4000.00, 'expense', '2026-03-27 07:42:05.077', 10, 'ค่าเช่าบ้าน', '2026-03-28', 2),
(8, 2000.00, 'income', '2026-03-27 07:47:23.254', 4, 'ขายไอเทมเกม', '2026-03-27', 3),
(9, 200.00, 'expense', '2026-03-27 08:08:38.522', 11, '', '2026-03-28', 2),
(10, 20000.00, 'income', '2026-03-27 08:10:12.980', 5, 'โบนัสทำงานดีเด่น', '2026-03-31', 2),
(11, 500.00, 'expense', '2026-03-28 02:35:19.606', 8, '', '2026-03-28', 2),
(15, 10000.00, 'expense', '2026-03-28 04:26:22.578', 12, '', '2026-04-03', 2);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `name`, `email`, `password`, `createdAt`) VALUES
(1, 'patcharapon', 'aaabbbcccddd@gmail.com', 'air12300', '2026-03-24 12:34:18.963'),
(2, 'smith', 'aaaxxx@gmail.com', '$2a$10$18NX2mRcudb2oA8NAbbSyOiDeou0xla.Q/Tn6x/nppp0tf8WF2p0u', '2026-03-25 09:12:18.594'),
(3, 'roberto', 'gggg@gmail.com', '$2a$10$bOYOwGR.dXSDNIrBS/tCFu0v9XRTYGb4GjA7OiPvbp4V6TPc6d6sy', '2026-03-27 05:47:32.494');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Transaction`
--
ALTER TABLE `Transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Transaction_userId_fkey` (`userId`),
  ADD KEY `Transaction_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `Transaction`
--
ALTER TABLE `Transaction`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Transaction`
--
ALTER TABLE `Transaction`
  ADD CONSTRAINT `Transaction_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

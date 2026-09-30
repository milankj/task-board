-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: board
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `board`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `board` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `board`;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20260929084000-create-users.js'),('20260929090818-create-user-settings.js'),('20260929095332-create-tasks.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `tasks_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `description` text,
  `story_point` int NOT NULL,
  `priority` enum('critical','high','medium','low') NOT NULL,
  `owner_id` varchar(255) NOT NULL,
  `planned_date` datetime DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `status` enum('backlog','planned','progress','completed') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`tasks_id`),
  CONSTRAINT `tasks_story_point_positive` CHECK ((`story_point` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES ('146c4752-a720-4c3d-9abf-df5435a04615','Integrate Stripe Payment Gateway','Credit card checkout and webhook processing',5,'high','7d443736-7bc3-4a26-b1d8-62fb1438a795','2026-09-30 00:00:00','2026-10-07 00:00:00','progress','2026-09-30 16:19:21','2026-09-30 16:19:21'),('5fdeda8a-0012-46a9-8d09-f266a4536414','Implement Two-Factor Authentication','Bind authenticator apps for 2FA security',5,'low','7d443736-7bc3-4a26-b1d8-62fb1438a795','2026-09-30 00:00:00','2026-10-14 00:00:00','backlog','2026-09-30 16:20:28','2026-09-30 16:20:28'),('8992f27a-f562-4e9d-b5bb-99a622c3f07a','Setup Redis Cache for Auth Token Blacklist','Implement Memcached/Redis token invalidation helper on user logout',3,'high','7d443736-7bc3-4a26-b1d8-62fb1438a795','2026-09-30 00:00:00','2026-10-02 00:00:00','completed','2026-09-30 16:18:12','2026-09-30 16:18:12'),('8a6ec316-d8d0-4f22-ba59-46987c0c5ab6','Setup Automated Database Backups','Daily automated database snapshots with retention',2,'low','7d443736-7bc3-4a26-b1d8-62fb1438a795','2026-10-01 00:00:00','2026-10-09 00:00:00','planned','2026-09-30 16:19:53','2026-09-30 16:24:30'),('a129afa1-118a-4e4d-bc4d-e94afda76bba','Fix Mobile Navigation Overflow Bug','Resolve layout clipping issue on iOS Safari',1,'critical','7d443736-7bc3-4a26-b1d8-62fb1438a795','2026-09-30 00:00:00','2026-10-02 00:00:00','planned','2026-09-30 16:20:53','2026-09-30 16:20:53');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_settings`
--

DROP TABLE IF EXISTS `user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_settings` (
  `settings_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `daily_point_limit` int DEFAULT NULL,
  `weekly_point_limit` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`settings_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_settings`
--

LOCK TABLES `user_settings` WRITE;
/*!40000 ALTER TABLE `user_settings` DISABLE KEYS */;
INSERT INTO `user_settings` VALUES ('686010ef-daba-40cf-990f-be14d4e34e6a','7d443736-7bc3-4a26-b1d8-62fb1438a795',10,20,'2026-09-30 06:40:59','2026-09-30 15:04:27');
/*!40000 ALTER TABLE `user_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('7d443736-7bc3-4a26-b1d8-62fb1438a795','Admin Test','admin@test.com','$2b$10$y8OdiIvnkd6Jtie0LQENYu5Qo4o2ZXIXAflJt5BX0pn4BREI8wHY.','2026-09-30 05:09:44','2026-09-30 05:09:44');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'board'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-30 16:45:53

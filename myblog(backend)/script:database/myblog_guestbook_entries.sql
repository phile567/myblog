-- MySQL dump 10.13  Distrib 8.0.43, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: myblog
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `guestbook_entries`
--

DROP TABLE IF EXISTS `guestbook_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guestbook_entries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `message` text NOT NULL,
  `name` varchar(100) NOT NULL,
  `replied_at` datetime(6) DEFAULT NULL,
  `reply` text,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `user_type` enum('GUEST','REGISTERED') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guestbook_entries`
--

LOCK TABLES `guestbook_entries` WRITE;
/*!40000 ALTER TABLE `guestbook_entries` DISABLE KEYS */;
INSERT INTO `guestbook_entries` VALUES (2,'2025-08-27 12:02:15.000000','lisi@example.com',NULL,'这个博客很不错！','李四',NULL,NULL,'2025-08-27 12:02:15.000000',NULL,'GUEST'),(3,'2025-08-27 12:02:15.000000','test@example.com',NULL,'博主测试留言','test',NULL,NULL,'2025-08-27 12:02:15.000000',NULL,'REGISTERED'),(12,'2025-08-27 12:26:31.863855','','0:0:0:0:0:0:0:1','谢谢你','test',NULL,NULL,'2025-08-27 12:26:31.863855',1,'REGISTERED'),(13,'2025-08-27 12:27:43.350603','','0:0:0:0:0:0:0:1','我也觉得这个博客不错','phile','2025-08-27 15:38:34.776531','爱你','2025-08-27 15:38:34.777595',3,'REGISTERED'),(16,'2025-08-27 15:41:29.643215','','0:0:0:0:0:0:0:1','今天又加班饿','小三',NULL,NULL,'2025-08-27 15:41:29.643215',NULL,'GUEST'),(17,'2025-08-27 15:41:57.226689','','0:0:0:0:0:0:0:1','马上睡觉','phile',NULL,NULL,'2025-08-27 15:41:57.226689',3,'REGISTERED'),(18,'2025-08-28 01:18:09.779747','','0:0:0:0:0:0:0:1','gpt使用上限了','admin',NULL,NULL,'2025-08-28 01:18:09.779747',4,'REGISTERED');
/*!40000 ALTER TABLE `guestbook_entries` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-30 15:12:37

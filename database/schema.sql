CREATE DATABASE IF NOT EXISTS se_course_db;
USE se_course_db;

CREATE TABLE IF NOT EXISTS `user` (
  userEmail VARCHAR(85) NOT NULL PRIMARY KEY,
  userPassword VARCHAR(72) NOT NULL,
  userFirstName VARCHAR(50) NOT NULL,
  userLastName VARCHAR(50) NOT NULL,
  userTel VARCHAR(50) NOT NULL,
  dateOfBirth DATE NOT NULL
);

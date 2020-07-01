DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department1(
id INT NOT NULL AUTO_INCREMENT,
department VARCHAR(30) NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE role(
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL(11,4) NULL,
department_id INT NOT NULL,
PRIMARY KEY(id)
FOREIGN KEY(department_id) REFERENCES department1(id)
ON DELETE CASCADE
);

CREATE TABLE employee(
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
PRIMARY KEY(id)
FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE CASCADE,
FOREIGN KEY(manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department1(department)
VALUES("sales");
INSERT INTO department1(department)
VALUES("engineering");
INSERT INTO department1(department)
VALUES("legal");

INSERT INTO role(title,salary,department_id)
VALUES("sales_lead",103456.56,1);
INSERT INTO role(title,salary,department_id)
VALUES("sales_person",73456.56,1);
INSERT INTO role(title,salary,department_id)
VALUES("software_engineer",459456.56,2);
INSERT INTO role(title,salary,department_id)
VALUES("lead_engineer",509456.56,2);
INSERT INTO role(title,salary,department_id)
VALUES("lawyer",159456.56,3);
INSERT INTO role(title,salary,department_id)
VALUES("legal team lead",179456.56,3);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES("bhagyashree","acharya",2,1);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES("Sunil","CR",2,1);
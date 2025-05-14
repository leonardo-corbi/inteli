const db = require('../config/db.js');

const runSQLScript = async () => {
  const query = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    );

    INSERT INTO users (name, email)
    VALUES 
      ('Alice Smith', 'alice.smith@example.com'),
      ('Bob Johnson', 'bob.johnson@example.com'),
      ('Carol Williams', 'carol.williams@example.com'),
      ('David Jones', 'david.jones@example.com'),
      ('Emma Brown', 'emma.brown@example.com'),
      ('Frank Davis', 'frank.davis@example.com'),
      ('Grace Wilson', 'grace.wilson@example.com'),
      ('Henry Moore', 'henry.moore@example.com'),
      ('Isabella Taylor', 'isabella.taylor@example.com'),
      ('Jack Lee', 'jack.lee@example.com'),
      ('Kate Clark', 'kate.clark@example.com'),
      ('Liam Martinez', 'liam.martinez@example.com'),
      ('Mia Rodriguez', 'mia.rodriguez@example.com'),
      ('Noah Garcia', 'noah.garcia@example.com'),
      ('Olivia Hernandez', 'olivia.hernandez@example.com'),
      ('Patrick Martinez', 'patrick.martinez@example.com'),
      ('Quinn Lopez', 'quinn.lopez@example.com'),
      ('Rose Thompson', 'rose.thompson@example.com'),
      ('Samuel Perez', 'samuel.perez@example.com'),
      ('Tara Scott', 'tara.scott@example.com');
  `;

  try {
    await db.query(query);
    console.log('SQL script executed successfully.');
  } catch (error) {
    console.error('Error executing SQL script:', error);
  }
};

runSQLScript();
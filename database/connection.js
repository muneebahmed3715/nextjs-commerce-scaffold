const fs = require('fs');
const path = require('path');

const databaseDir = path.resolve(process.cwd(), 'database');
const databaseFile = path.join(databaseDir, 'app_database.db');

function ensureDatabaseDirectory() {
  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }
}

function getDatabaseFilePath() {
  ensureDatabaseDirectory();
  return databaseFile;
}

function getDatabaseUrlForPrismaSchema() {
  // Relative to prisma/schema.prisma
  return 'file:../database/app_database.db';
}

module.exports = {
  ensureDatabaseDirectory,
  getDatabaseFilePath,
  getDatabaseUrlForPrismaSchema,
};

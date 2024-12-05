import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL
    // host: 'ep-black-sound-a58b2xbi.us-east-2.aws.neon.tech', // Host of your PostgreSQL instance
    // port: 5432, // Default port for PostgreSQL
    // user: 'Mock-Interview-DB_owner', // Username
    // password: 'lCUYvn6GcfH4', // Password
    // database: 'Mock-Interview-DB', // Database name
    // ssl: true, // Use SSL if required
  },
});

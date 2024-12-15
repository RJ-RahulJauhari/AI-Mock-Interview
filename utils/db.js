import { drizzle } from 'drizzle-orm/neon-http';
import {neon, neonConfig} from '@neondatabase/serverless';

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL)
const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL);
export default db;
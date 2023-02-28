import { readFile, writeFile } from 'node:fs/promises';
import * as T from './types';

const databaseFilePath = process.env.DATABASE_FILE || 'database.json';

function makeNewDatabase(): T.Database {
  return []
}

export async function readDatabase(): Promise<T.Database> {
  try {
    const databaseAsString = await readFile(databaseFilePath, {encoding: 'utf-8'});
    const database: T.Database = JSON.parse(databaseAsString);
    return database;

  } catch (err) {
    if (err instanceof Error && (err as any /* You caught me, plz just this one time */).code === 'ENOENT') {
      return makeNewDatabase();
    }
    
    throw err;
  }
}

export async function writeDatabase(database: T.Database): Promise<void> {
  const databaseAsString = JSON.stringify(database, null, '\t');
  await writeFile(databaseFilePath, databaseAsString, {encoding: 'utf-8'});
}
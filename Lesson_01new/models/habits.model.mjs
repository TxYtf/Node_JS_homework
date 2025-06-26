import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB = join(__dirname, '..', 'database.json');


const read = async () => {
  try {
    const content = await readFile(DB, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch {
    return []; // порожній масив якщо файл не існує або порожній
  }
};
const save = async (data) => writeFile(DB, JSON.stringify(data, null, 2));

export async function create(payload) {
  const db = await read();
  const habit = { id: Date.now().toString(), ...payload };
  await save([...db, habit]);
  return habit;
};

export async function getAll() {
  const db = await read();
  return [...db];
};

export async function update(payload) {
  const db = await read();
  const idx = db.findIndex((u) => u.id === payload.id);
  if (idx === -1) return null;
  db[idx] = { ...db[idx], ...payload };

  await save(db);
  return db[idx];
};

export async function remove(id) {
  const db = await read();
  const next = db.filter((u) => u.id !== id);
  if (next.length === db.length) return false;
  await save(next);
  return true;
};


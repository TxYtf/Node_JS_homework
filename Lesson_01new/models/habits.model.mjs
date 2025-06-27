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
  const renamed = db.map(h => ({
    'ID звички': h.id,
    'Назва звички': h.name,
    'Частота': h.freq,
    'Дата': h.date,
    'Виконано': h.done
  }));

  return renamed;
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

export async function doneById(payload) {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const nowFormatted = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}_${pad(now.getHours())}:${pad(now.getMinutes())}`;  
  
  const date = payload.date ?? nowFormatted;
  const idToFind = payload.id;

  const db = await read();
  const idx = db.findIndex((u) => u.id === idToFind);
  if (idx === -1) return null;

  const done = { id: db[idx].id, name: db[idx].name, freq: db[idx].freq, date: date, done: 'true' };
  await create(done);
  return done;
};

export async function stats() {
  const db = await read();
  const statsMap = db.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = { id: item.id, total: 0, done: 0 };
    }
    acc[item.id].total += 1;
    if (item.done === 'true') acc[item.id].done += 1;
    return acc;
  }, {});

  const result = Object.values(statsMap).map(entry => ({
    ...entry,
    'percentage-done': Math.round((entry.done / entry.total) * 100)
  }));
  return result;
};
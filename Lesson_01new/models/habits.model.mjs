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
const now = Date.now() + process.env.DAY_OFFSET * 24 * 60 * 60 * 1000;

export async function create(options) {
   const db = await read(); 
  
  let habitID;
  if (options.name) {
    const nameToFind = options.name;
    const idx = db.findIndex((u) => u.name === nameToFind);
    habitID = (idx === -1) ? now.toString() : db[idx].id
  } else {
    return { error: 'Habit name not found' };
  }

  let habitDate;
  if (!options.date) {
    habitDate = now;
  } else {
    habitDate = (options.date.indexOf('_') >= 0 || options.date.indexOf('.') >= 0 || options.date.indexOf(':') >= 0)
              ? dateToNumber(options.date)
              : habitDate = options.date;
  }
  //const usualDateFormat = new Date(habitDate);

  const habit = { id: habitID, name: options.name, freq: options.freq, date: habitDate, done: options.done };
  await save([...db, habit]);
  return habit;
};

export async function getAll() {
  const db = await read();
  const renamed = db.map(h => ({
    'ID звички': h.id,
    'Назва звички': h.name,
    'Частота': h.freq,
    'Дата': dateToUsualFormat(h.date),
    'Виконано': h.done
  }));
  return renamed;
};

export async function update(options) {
  const db = await read();
  const idx = db.findIndex((u) => u.id === options.id);
  if (idx === -1) return null;

  let habitDate;
  if (options.date) {
    habitDate = (options.date.indexOf('_') >= 0 || options.date.indexOf('.') >= 0 || options.date.indexOf(':') >= 0)
              ? dateToNumber(options.date)
              : options.date;
  } else {
    habitDate = db[idx].date;
  };

  db[idx] = { ...db[idx], ...options, date: habitDate };

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

export async function doneById(options) {
  const date = options.date ?? now;
  const idToFind = options.id;

  const db = await read();
  const idx = db.findIndex((u) => u.id === idToFind);
  if (idx === -1) return null;

  const done = { id: db[idx].id, name: db[idx].name, freq: db[idx].freq, date: date, done: 'true' };
  return await create(done);
};

export async function stats() {
  const lastWeek = now - 7 * 24 * 60 * 60 * 1000;
  const lastMonth = now - 30 * 24 * 60 * 60 * 1000;

  const db = await read();
  const weekStats = db.filter(item => item.date >= lastWeek);
  const monthStats = db.filter(item => item.date >= lastMonth);

   const countById = (arr) => {
    return arr.reduce((acc, item) => {
      if (!acc[item.id]) acc[item.id] = { name: item.name, count: 0, freq: item.freq };
      acc[item.id].count += 1;
      return acc;
    }, {});
  };

  const monthCounts = countById(monthStats);
  const weekCounts = countById(weekStats);

  // Збираємо всі унікальні id
  const allIds = Array.from(new Set([
    ...Object.keys(monthCounts),
    ...Object.keys(weekCounts)
  ]));

  const statsPercentage = (count, freq, period) => {
    let res;
    switch (freq) {
      case 'daily':
        res = (period === 30) ? count/30 : ((period === 7) ? count/7 : -1);
        break;
      case 'weekly':
        res = (period === 30) ? count/4 : ((period === 7) ? count : -1);
        break;
      case 'monthly':
        res = count 
        break;
      default:
        res = -1;
        break;
    };
    const formatted = (res === -1) ? '---' : (res * 100).toFixed(1) + ' %';

    return formatted;
  }

  const result = allIds.map(id => ({
    id,
    name: monthCounts[id]?.name || weekCounts[id]?.name || null,
    freq: monthCounts[id]?.freq || weekCounts[id]?.freq || null,
    month: statsPercentage(monthCounts[id]?.count, monthCounts[id]?.freq, 30) || 0,
    week: statsPercentage(weekCounts[id]?.count, weekCounts[id]?.freq, 7) || 0
  }));

  return result;
};

function dateToNumber(param) {
  console.log('param = '+param);
  const [datePart, timePart] = param.split('_');
  const [day, month, year] = datePart.split('.').map(Number);
  const [hour, minute, second = 0] = timePart.split(':').map(Number);

  return new Date(year, month - 1, day, hour, minute, second).getTime();
}

function dateToUsualFormat(param) {
  const usualDateFormat = new Date(param);
  return usualDateFormat;
}
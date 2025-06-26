import {
  addHabit, listhabits, updateHabit, deleteHabit, doneHabit, habitStats
} from '../services/habits.service.mjs';

export async function handle(command, options) {
  try {
    if (command === 'add') {
      const body = options;
      return json('add', 201, await addHabit(body));
    };

    if (command === 'list') {
      //const data = await listhabits();
      console.table(await listhabits());
      return json(command, 200);
    };

    if (command === 'update') {
      const u = await updateHabit(options);
      return u ? json(command, 200, u) : json('error', 404, { error: 'Not found' });
    };

    if (command === 'delete') {
      const ok = await deleteHabit(options.id);
      return ok ? json(command, 204) : json('error', 404, { error: 'Not found' });
    };

    if (command === 'done') {
      const ok = await doneHabit(options.id);
      return ok ? json(command, 200) : json('error', 404, { error: 'Not found' });
    };

    if (command === 'stats') {
      const u = await habitStats(options.id);
      return u ? json(command, 200, u) : json('error', 404, { error: 'Not found' });
    };

    json('error', 405, { error: 'Command not allowed' });
  } catch (e) {
    json('error', 500, { error: e.message });
  }
}

/* ---------- helpers ---------- */
function json(res, status, data = {}) {
  if (data || data=={}) return {res, status, data};
  else return {};
};

import {
  addHabit, listhabits, updateHabit, deleteHabit, doneHabit, habitStats
} from '../services/habits.service.mjs';

export async function handle(command, options) {
  try {
    if (command === 'add') {
      const added = await addHabit(options);
      return json('add', 201, added);
    };

    if (command === 'list') {
      const habitsList = await listhabits();
      console.table(habitsList);
      return json(command, 200);
    };

    if (command === 'update') {
      const updated = await updateHabit(options);
      return updated ? json(command, 200, updated) : json('error', 404, { error: 'Not found' });
    };

    if (command === 'delete') {
      const delOk = await deleteHabit(options.id);
      return delOk ? json(command, 204) : json('error', 404, { error: 'Not found' });
    };

    if (command === 'done') {
      const doneOk = await doneHabit(options);
      return doneOk ? json(command, 200) : json('error', 404, { error: 'Not found' });
    };

    if (command === 'stats') {
      const statsList = await habitStats();
      console.table(statsList);
      return json(command, 200);
    };

    json('error', 405, { error: 'Command not allowed' });
  } catch (e) {
    json('error', 500, { error: e.message });
  }
}

/* ---------- helpers ---------- */
function json(command, status, data = {}) {
  if (data || data=={}) return {command, status, data};
  else return {};
};

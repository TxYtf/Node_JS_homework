import {
  addHabit, listhabits, updateHabit, deleteHabit, doneHabit, habitStats
} from '../services/habits.service.mjs';

export const commandAdd = (options) => {
  return addHabit(options);
};

export const commandList = () => {
  console.table(listhabits());
  return {};
};

export const commandUpdate = (options) => {
  return updateHabit(options);
};

export const commandDelete = (id) => {
  return deleteHabit(id);
};

export const commandDone = (options) => {
  return doneHabit(options);
};

export const commandStats = () => {
  const statsList = habitStats();
  console.table(statsList);
  return {};
};


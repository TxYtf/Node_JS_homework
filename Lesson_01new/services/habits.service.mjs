import * as model from '../models/habits.model.mjs';

export const addHabit     = (options)   => model.create(options);
export const listhabits   = ()          => model.getAll();
export const updateHabit  = (options)   => model.update(options);
export const deleteHabit  = (id)        => model.remove(id);
export const doneHabit    = (options)   => model.doneById(options);
export const habitStats   = ()          => model.stats();
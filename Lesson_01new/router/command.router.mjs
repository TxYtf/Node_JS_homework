import {
  commandAdd, commandList, commandUpdate, commandDelete, commandDone, commandStats
} from '../controllers/habits.controller.mjs';

let respDescript = {};
let respCode;
export async function handle(command, options) {
  try {
    switch (command) {
        case 'add':
            respDescript = await commandAdd(options);
            respCode = 201;
            break;
        case 'list':
            respDescript = await commandList(); 
            respCode = 200;            
            break;
        case 'update':
            respDescript = await commandUpdate(options);
            if (respDescript)
                respCode = 200;
            else {
                respCode = 404;
                respDescript = { error: 'Not found' }
            };
            break;
        case 'delete':
            respDescript = await commandDelete(options.id);
            if (respDescript)
                respCode = 204;
            else {
                respCode = 404;
                respDescript = { error: 'Not found' }
            };           
            break;
        case 'done':
            respDescript = await commandDone(options);
            if (respDescript)
                respCode = 200;
            else {
                respCode = 404;
                respDescript = { error: 'Not found' }
            };
            break;
        case 'stats':
            respDescript = await commandStats(options);
            respCode = 200;            
            break;            
        default:
            respDescript = {error: 'Command not allowed'};
            respCode = 405;
    }
    return json(command, respCode, respDescript);
  } catch (e) {
    return json('error', 500, { error: e.message });
  };
}

function json(command, status, data = {}) {
  if (data || data=={}) return {command, status, data};
  else return {};
};
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
            respDescript = commandDelete(options.id);
            if (respDescript)
                respCode = 204;
            else {
                respCode = 404;
                respDescript = { error: 'Not found' }
            };           
            break;
        case 'done':
            respDescript = commandDone(options);
            if (respDescript)
                respCode = 200;
            else {
                respCode = 404;
                respDescript = { error: 'Not found' }
            };
            break;
        case 'stats':
            commandStats(options);
            respDescript = {}
            respCode = 200;            
            break;            
        default:
            json('error', 405, { error: 'Command not allowed' });
    }
    return json(command, respCode, respDescript);
  } catch (e) {
    json('error', 500, { error: e.message });
  };
}

function json(command, status, data = {}) {
  if (data || data=={}) return {command, status, data};
  else return {};
};
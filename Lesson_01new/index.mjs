//require('dotenv').config(); // тепер має бути доступний process.env.PORT

//import dotenv from 'dotenv';
//dotenv.config(); //dotenv.config({ path: '../config/.env' }); //якщо .env знаходиться не в корені проекту

import 'dotenv/config';
import { handle as habitCtrl } from './controllers/habits.controller.mjs';

//console.log(process.env.PORT);

const args = process.argv.slice(2);
const options = {};
let command = '';

args.forEach(arg => {
  if (arg.startsWith('/')) {
    command = arg.slice(1);
  } else if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    options[key] = value ?? true;
  };

});

console.log(await habitCtrl(command, options));

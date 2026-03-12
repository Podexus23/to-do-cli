#!/usr/bin/env node

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { applicationController } from './controller.js';
import { checkTasksFile, getTasksData } from './task.model.js';

const rl = createInterface({ input, output });

async function main() {
  let isRunning = true;

  try {
    await checkTasksFile();
    await getTasksData();

    while (isRunning) {
      const answer = await rl.question('> ');
      if ((await applicationController(answer)) === false) isRunning = false;
    }
    rl.close();
  } catch (error) {
    if (error instanceof Error) console.error(`Error: ${error.message}`);
    else console.error('Unknown error');
  }
}

await main();
